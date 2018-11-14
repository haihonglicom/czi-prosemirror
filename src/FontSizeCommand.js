// @flow

import UICommand from './ui/UICommand';
import applyMark from './applyMark';
import createPopUp from './ui/createPopUp';
import nullthrows from 'nullthrows';
import {EditorState} from 'prosemirror-state';
import {EditorView} from 'prosemirror-view';
import {MARK_FONT_SIZE} from './MarkNames';
import {Schema} from 'prosemirror-model';
import {TextSelection} from 'prosemirror-state';
import {Transform} from 'prosemirror-transform';

// 1 pt	~= 1.3281472327365px
const PT_TO_PX = 1.3281472327365;
const FONT_PT_SIZES = [8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 90];
const FONT_PX_SIZES = FONT_PT_SIZES.map(x => Math.round(x * PT_TO_PX));

function createGroup(): Array<{[string]: FontSizeCommand}> {
  const group = {};
  group['default'] = new FontSizeCommand(0);

  FONT_PX_SIZES.forEach((pxSize, ii) => {
    const ptSize = FONT_PT_SIZES[ii];
    // Chrome re-ordering object keys if numerics, is that normal/expected
    // add extra space to prevent that.
    const label = ` ${ptSize} `;
    group[label] = new FontSizeCommand(pxSize);
  });
  return [group];
}

function setFontSize(
  tr: Transform,
  schema: Schema,
  size: number,
): Transform {
  const markType = schema.marks[MARK_FONT_SIZE];
  if (!markType) {
    return tr;
  }
  const {selection} = tr;
  if (!(selection instanceof TextSelection)) {
    return tr;
  }
  const attrs = size ? {size: `${size}px`} : null;
  tr = applyMark(
   tr,
   schema,
   markType,
   attrs,
 );
  return tr;
}

class FontSizeCommand extends UICommand {

  static createGroup = createGroup;

  _popUp = null;
  _pxSize = 0;

  constructor(pxSize: number) {
    super();
    this._pxSize = pxSize;
  }

  isEnabled = (state: EditorState): boolean => {
    const {schema, selection} = state;
    if (!(selection instanceof TextSelection)) {
      return false;
    }
    const markType = schema.marks[MARK_FONT_SIZE];
    if (!markType) {
      return false;
    }
    return !selection.empty;
  };

  execute = (
    state: EditorState,
    dispatch: ?(tr: Transform) => void,
    view: ?EditorView,
  ): boolean => {
    const {schema, selection} = state;
    const tr = setFontSize(
      state.tr.setSelection(selection),
      schema,
      this._pxSize,
    );
    if (dispatch && tr.docChanged) {
      dispatch(tr);
      return true;
    }
    return false;
  };
}

export default FontSizeCommand;
