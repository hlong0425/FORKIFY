import View from "./View";
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _error = `No bookmarks yet. Find a nice recipe and bookmark it :)`;

  _generateMarkup() {
    console.log(this._data);
    return this._data.map(recipe => previewView.render(recipe, false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load', function () {
      handler();
    })
  }
}

export default new BookmarksView()