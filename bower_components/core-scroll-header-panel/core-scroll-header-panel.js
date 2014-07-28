

  Polymer('core-scroll-header-panel', {
    
    /**
     * Fired when the content has been scrolled.
     *
     * @event scroll
     */
     
    /**
     * Fired when the header is transformed.
     *
     * @event core-header-transform
     */
     
    publish: {
      /**
       * If true, the header's height will condense to `condensedHeaderHeight`
       * as the user scrolls down from the top of the content area.
       *
       * @attribute condenses
       * @type boolean
       * @default false
       */
      condenses: false,

      /**
       * If true, no cross-fade transition from one background to another.
       *
       * @attribute noDissolve
       * @type boolean
       * @default false
       */
      noDissolve: false,

      /**
       * If true, the header doesn't slide back in when scrolling back up.
       *
       * @attribute noReveal
       * @type boolean
       * @default false
       */
      noReveal: false,

      /**
       * If true, the header is fixed to the top and never moves away.
       *
       * @attribute fixed
       * @type boolean
       * @default false
       */
      fixed: false,
      
      /**
       * If true, the condensed header is always shown and does not move away.
       *
       * @attribute keepCondensedHeader
       * @type boolean
       * @default false
       */
      keepCondensedHeader: false,

      /**
       * The height of the header when it is at its full size.
       *
       * By default, the height will be measured when it is ready.  If the height
       * changes later the user needs to either set this value to reflect the
       * new height or invoke `measureHeaderHeight()`.
       *
       * @attribute headerHeight
       * @type number
       */
      headerHeight: 0,

      /**
       * The height of the header when it is condensed.
       *
       * By default, this will be 1/3 of `headerHeight`.
       *
       * @attribute condensedHeaderHeight
       * @type number
       */
      condensedHeaderHeight: 0,
    },

    prevScrollTop: 0,
    
    headerMargin: 0,
    
    y: 0,
    
    observe: {
      'headerMargin fixed': 'setup'
    },
    
    domReady: function() {
      this.async('measureHeaderHeight');
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    get scroller() {
      return this.$.mainContainer;
    },
    
    measureHeaderHeight: function() {
      var header = this.header;
      if (this.header) {
        this.headerHeight = header.offsetHeight;
      }
    },
    
    headerHeightChanged: function() {
      if (this.condensedHeaderHeight) {
        this.condensedHeaderHeightChanged();
      } else {
        // assume condensedHeaderHeight is 1/3 of the headerHeight
        this.condensedHeaderHeight = this.headerHeight * 1 / 3;
      }
    },
    
    condensedHeaderHeightChanged: function() {
      if (this.headerHeight) {
        this.headerMargin = this.headerHeight - this.condensedHeaderHeight;
      }
    },
    
    setup: function() {
      var s = this.scroller.style;
      s.paddingTop = this.fixed ? null : this.headerHeight + 'px';
      s.top = this.fixed ? this.headerHeight + 'px' : null;
      if (this.fixed) {
        this.transformHeader(0);
      } else {
        this.scroll();
      }
    },
    
    transformHeader: function(y) {
      var s = this.$.headerContainer.style;
      this.translateY(s, -y);
      
      if (this.condenses) {
        // adjust top bar in core-header so the top bar stays at the top
        if (this.header.$ && this.header.$.topBar) {
          s = this.header.$.topBar.style;
          this.translateY(s, Math.min(y, this.headerMargin));
        }
        // transition header bg
        s = this.$.headerBg.style;
        if (!this.noDissolve) {
          s.opacity = (this.headerMargin - y) / this.headerMargin;
        }
        // adjust header bg so it stays at the center
        this.translateY(s, y / 2);
        // transition condensed header bg
        if (!this.noDissolve) {
          s = this.$.condensedHeaderBg.style;
          s.opacity = y / this.headerMargin;
          // adjust condensed header bg so it stays at the center
          this.translateY(s, y / 2);
        }
      }
      
      this.fire('core-header-transform',
          {y: y, height: this.headerHeight, condensedHeight: this.condensedHeaderHeight});
    },
    
    translateY: function(s, y) {
      s.webkitTransform = s.transform = 'translate3d(0, ' + y + 'px, 0)';
    },
    
    scroll: function() {
      if (!this.header) {
        return;
      }
      
      var sTop = this.scroller.scrollTop;
      
      var y = Math.min(this.keepCondensedHeader ? 
          this.headerMargin : this.headerHeight, Math.max(0, 
          (this.noReveal ? sTop : this.y + sTop - this.prevScrollTop)));
      
      if (this.condenses && this.prevScrollTop > sTop && sTop > this.headerMargin) {
        y = Math.max(y, this.headerMargin);
      }
      
      if (!this.fixed && y !== this.y) {
        requestAnimationFrame(this.transformHeader.bind(this, y));
      }
      
      this.prevScrollTop = sTop;
      this.y = y;
      
      this.fire('scroll', {target: this.scroller}, this, false);
    }

  });

