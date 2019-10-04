(function(config) {

  // Use Google Forms for data storage
  // Geocode postcode data using https://postcodes.io/
  //
  // https://github.com/jsdevel/google-form
  // https://www.codeproject.com/tips/721795/store-your-form-data-in-google-spreadsheet

  var wrapperEl;
  var toggleEl;
  var formEl;
  var cancelEl;
  var inputEls;
  var postcodeEl;

  function init() {
    wrapper = document.querySelector('.Wrapper');
    toggleEl = document.querySelector('.Welcome-toggle');
    formEl = document.querySelector('.Form');
    submitEl = formEl.querySelector('.Form-submit');
    cancelEl = formEl.querySelector('.Form-cancel');
    inputEls = formEl.querySelectorAll('.Form-input');
    postcodeEl = formEl.querySelector('#postcode');

    toggleEl.addEventListener('click', showForm);
    cancelEl.addEventListener('click', hideForm);
    formEl.addEventListener('submit', handleFormSubmit);

    inputEls.forEach(function(inputEl) {
      inputEl.addEventListener('input', checkInputValidity);
    });
  }

  function showForm(e) {
    e.preventDefault();
    wrapper.classList.add('is-focused');
    inputEls[0].focus();
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    convertPostcodeToLatLon();
  }

  function checkInputValidity() {
    var valid = true;
    inputEls.forEach(function(inputEl) {
      if (!inputEl.validity.valid) {
        valid = false;
      }
    });
    submitEl.disabled = !valid;
  }

  // attempt geocoding for postcode - but store response regardless of success
  function convertPostcodeToLatLon() {
    var postcode = postcodeEl.value;

    var url = 'https://api.postcodes.io/postcodes/' + postcode;

    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.send();
    request.onreadystatechange = handlePostcodeResponse;
  }

  function handlePostcodeResponse() {
    if (this.readyState === 4) {
      var latLon = null;

      // carry on anyway, but if we get a lat/lon then use it
      if (this.status === 200 || this.status === 0) {
        var response = JSON.parse(this.response);
        if (response.result && response.result.latitude && response.result.longitude) {
          latLon = {
            'lat': response.result.latitude,
            'lon': response.result.longitude
          }
        }
      }

      prepareFormData(latLon);
    }
  }

  function prepareFormData(latLon) {
    var data = ['submit=Submit'];

    if (latLon) {
      data.push(config.form.lat + '=' + latLon.lat);
      data.push(config.form.lon + '=' + latLon.lon);
    }

    inputEls.forEach(function(inputEl) {
      data.push(config.form[inputEl.id] + '=' + encodeURIComponent(inputEl.value));
    });

    var url = "https://docs.google.com/forms/d/" + config.form.id + '/formResponse?' + data.join('&');

    processFormData(url, data);
  }

  function processFormData(url, data) {
    request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send();
    request.onreadystatechange = handleFormResponse;
  }

  function handleFormResponse() {
    if (this.readyState === 4) {
      // show success state regardless, but if there was an error we'd know here
      if (this.status !== 200 && this.status !== 0) {
        console.log(this);
      }

      showSuccess();
    }
  }

  function showSuccess() {
    formEl.classList.add('is-complete');
    setTimeout(hideForm, 3000);
  }

  function hideForm(e) {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    wrapper.classList.remove('is-focused');
    setTimeout(resetForm, 1000);
  }

  function resetForm() {
    formEl.classList.remove('is-complete');
    formEl.reset();
    checkInputValidity();
  }

  document.addEventListener('DOMContentLoaded', init);

})(window.CONFIG);
