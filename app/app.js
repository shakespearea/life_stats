(function(){

var $  = document.getElementById.bind(document);
var $$ = document.querySelectorAll.bind(document);

var App = function($el){
  this.$el = $el;
  this.load();
  this.setRandomBackground();
  this.setRandomCatGif();

  this.$el.addEventListener(
    'submit', this.submit.bind(this)
  );

  if (this.dob) {
    this.renderUpdateLoop();
  } else {
    this.renderChoose();
  }
};

App.fn = App.prototype;

App.fn.load = function(){
  var value;

  if (value = localStorage.dob)
    this.dob = new Date(parseInt(value));
};

App.fn.save = function(){
  if (this.dob)
    localStorage.dob = this.dob.getTime();
};

App.fn.submit = function(e){
  e.preventDefault();

  var input = this.$$('input')[0];
  if (!input.valueAsDate) return;

  this.dob = input.valueAsDate;
  this.save();
  this.renderUpdateLoop();
};

App.fn.renderChoose = function(){
  this.html(this.view('dob')());
};

App.fn.renderUpdateLoop = function(){
  this.updateInterval = setInterval(this.renderUpdate.bind(this), 100);
};

App.fn.renderUpdate = function(){
  var now = new Date();
  var duration = now - this.dob;
  var years = duration / 31556900000;

  var majorMinorAge = years.toFixed(9).toString().split('.');

  var yearCompletion = this.getYearCompletion(now);
  var majorMinorYear = yearCompletion.toFixed(9).toString().split('.');

  var wakingHoursLeft = this.getWakingHoursLeft(now);
  var majorMinorWakingHours = wakingHoursLeft.toFixed(4).toString().split('.');

  var christmasCountdown = this.getChristmasCountdown(now);
  var majorMinorChristmas = christmasCountdown.toFixed(6).toString().split('.');

  requestAnimationFrame(function(){
    this.html(this.view('main')({
      year: majorMinorAge[0],
      milliseconds: majorMinorAge[1],
      yearCompletionMajor: majorMinorYear[0],
      yearCompletionMinor: majorMinorYear[1],
      wakingHoursMajor: majorMinorWakingHours[0],
      wakingHoursMinor: majorMinorWakingHours[1],
      christmasMajor: majorMinorChristmas[0],
      christmasMinor: majorMinorChristmas[1]
    }));
  }.bind(this));
};

App.fn.getYearCompletion = function(now){
  var start = new Date(now.getFullYear(), 0, 1);
  var end = new Date(now.getFullYear() + 1, 0, 1);
  var yearDuration = end - start;
  var elapsed = now - start;
  return (elapsed / yearDuration) * 100;
};

App.fn.getWakingHoursLeft = function(now){
  var end = new Date(now.getFullYear() + 1, 0, 1);
  var hoursPerDay = 24;
  var averageSleepHours = 6.75; // 6 hours and 45 minutes
  var wakingHoursPerDay = hoursPerDay - averageSleepHours;
  var millisecondsLeft = end - now;
  var hoursLeft = millisecondsLeft / 36e5; // Convert milliseconds to hours
  var wakingDaysLeft = hoursLeft / hoursPerDay;
  return wakingDaysLeft * wakingHoursPerDay;
};

App.fn.getChristmasCountdown = function(now){
  var year = now.getFullYear();
  var christmas = new Date(year, 11, 25); // 25th December
  if (now > christmas) {
    christmas.setFullYear(year + 1);
  }
  var millisecondsLeft = christmas - now;
  var daysLeft = millisecondsLeft / 86400000; // Convert milliseconds to days
  return daysLeft;
};

App.fn.setRandomBackground = function(){
  var randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
  document.body.style.backgroundColor = randomColor;
};

App.fn.setRandomCatGif = function(){
  fetch('https://api.thecatapi.com/v1/images/search?mime_types=gif')
    .then(response => response.json())
    .then(data => {
      var catGifUrl = data[0].url;
      var img = document.createElement('img');
      img.src = catGifUrl;
      img.alt = 'Random Cat Gif';

      // Wait for the image to load to get its actual dimensions
      img.onload = function() {
        var catContainer = document.getElementById('cat-container');
        catContainer.style.width = img.width*0.75 + 'px';
        catContainer.style.height = img.height*0.75 + 'px';
        catContainer.innerHTML = '';  // Clear any existing image
        catContainer.appendChild(img);
      };
    });
};

App.fn.$$ = function(sel){
  return this.$el.querySelectorAll(sel);
};

App.fn.html = function(html){
  this.$el.innerHTML = html;
};

App.fn.view = function(name){
  var $el = $(name + '-template');
  return Handlebars.compile($el.innerHTML);
};

window.app = new App($('app'));

})();