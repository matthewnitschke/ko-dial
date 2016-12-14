ko.components.register("ko-dial", {
  viewModel: function(params){
    var self = this;

    self.percent = params.percent;
    if (!ko.unwrap(self.percent)){
      self.percent(0);
    }

    var defaults = {
      color: "#000",
      backgroundColor: "#FFF",
      sensitivity: .2,
      width: 32,
    }

    // changeable properties
    extendDefaults(params, defaults);

    var clicking = false;
    var clickedY = 0;
    var clickedPercent = 0;

    self.mousedown = function(vm, e){
      clicking = true;
      clickedY = e.y;
      clickedPercent = self.percent();
    }

    document.addEventListener("mousemove", function(e){
      if (clicking){
        var newPercent = clickedPercent + ((clickedY - e.y) * ko.unwrap(self.sensitivity));
        if (newPercent < 0){
          self.percent(0);
        } else if (newPercent > 100){
          self.percent(100);
        } else {
          self.percent(newPercent);
        }
      }
    })
    document.addEventListener("mouseup", function(e){
      clicking = false;
    })


    function extendDefaults(params, defaults){
      Object.keys(defaults).forEach(function(key){
        self[key] = defaults[key];
      });

      Object.keys(params).forEach(function(paramKey){
        Object.keys(defaults).forEach(function(defaultKey){
          if (paramKey == defaultKey){
            self[paramKey] = params[paramKey];
          }
        });
      });

    }
  },
  template: `
  <div data-bind="event: {mousedown: mousedown}" style="cursor: pointer">
    <svg viewBox="0 0 32 32" data-bind="attr: {style: 'background-color: ' + ko.unwrap(backgroundColor)}">
      <circle r="16" cx="16" cy="16" data-bind="attr: { stroke: ko.unwrap(color), 'stroke-dasharray': percent()+.46 + ' 100', 'stroke-width': ko.unwrap(width) }"></circle>
    </svg>
  </div>
  `
})
