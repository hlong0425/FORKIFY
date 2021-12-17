import View from "./View";
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _error = "don't find any result, plese search another one";
  // render = function (data) {
  //     this._data = data;
  //     const markup = this._generateMarkup();
  //     this._clear();
  //     this._parentElement.insertAdjacentHTML('afterbegin', markup);
  // }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView()