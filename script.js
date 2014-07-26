
document.addEventListener('polymer-ready', function() {
  var fab = document.getElementById('fab');
  fab.addEventListener('click', function() {
    var content = document.getElementById('content');
    
    var para = document.createElement("p");
    para.innerHTML = "More content...";
    
    var shadow = document.createElement("paper-shadow");
    shadow.setAttribute('z', '1');
    
    para.appendChild(shadow);
    content.appendChild(para);
  });
});
