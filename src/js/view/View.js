import icons from 'url:../../img/icons.svg';
export default class View {
  _data;

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner = function () {
    const markup = `
          <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  render = function (data, isRender = true) {
    if (!data || Array.isArray(data) && data.length === 0) {
      return this.renderError();
    }

    this._data = data;
    const markup = this._generateMarkup();

    if (!isRender) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update = function (data) {
    if (!data || Array.isArray(data) && data.length === 0) return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();

    // 1.Convert markupString to Dom node Object
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    for (let i = 0; i < curElements.length; i++) {
      let newEl = newElements[i];
      let curEl = curElements[i];

      //2Node khong bang nhau va First Child của Element sau khi xóa khoảng trắng là một giá trị #text; 
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        })
      }

    }
  }

  renderError(message = this._error) {
    const markup = `
    <div class="error">
      <div>
        <svg>
         <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>`;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}


















