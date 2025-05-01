(function() {
  var Tabletop = function(options) {
    this.key = options.key;
    this.callback = options.callback;
    this.simpleSheet = options.simpleSheet || false;
    this.sheets = {};
    this.init();
  };

  Tabletop.prototype.init = function() {
    var _this = this;
    var url = `https://spreadsheets.google.com/feeds/list/${this.key}/od6/public/values?alt=json`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        _this.parseData(data);
        if (_this.callback) {
          _this.callback(_this.sheets, _this);
        }
      })
      .catch(error => {
        console.error("Tabletop.js error:", error);
      });
  };

  Tabletop.prototype.parseData = function(data) {
    var _this = this;
    var sheetsData = data.feed.entry;
    
    sheetsData.forEach(function(entry) {
      // Assuming you have sheet names in your rows, modify this accordingly
      var sheetName = entry.gsx$sheetname ? entry.gsx$sheetname.$t : "Sheet1"; // Use a default sheet name if not provided
      if (!_this.sheets[sheetName]) {
        _this.sheets[sheetName] = [];
      }
      var rowData = {};
      for (var key in entry) {
        if (entry.hasOwnProperty(key) && key.startsWith("gsx$")) {
          rowData[key.slice(4)] = entry[key].$t;
        }
      }
      _this.sheets[sheetName].push(rowData);
    });
  };

  Tabletop.init = function(options) {
    return new Tabletop(options);
  };

  // Expose Tabletop to global scope
  if (typeof window !== "undefined") {
    window.Tabletop = Tabletop;
  }
})();
