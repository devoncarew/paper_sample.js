
    Polymer('core-transition', {
      
      type: 'transition',

      go: function(node, state) {
        this.complete(node);
      },

      setup: function(node) {
      },

      teardown: function(node) {
      },

      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  