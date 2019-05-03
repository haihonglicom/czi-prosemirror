'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isTextStyleMarkCommandEnabled;

var _isNodeSelectionForNodeType = require('./isNodeSelectionForNodeType');

var _isNodeSelectionForNodeType2 = _interopRequireDefault(_isNodeSelectionForNodeType);

var _prosemirrorState = require('prosemirror-state');

var _NodeNames = require('./NodeNames');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Whether the command for apply specific text style mark is enabled.
function isTextStyleMarkCommandEnabled(state, markName) {
  var selection = state.selection,
      schema = state.schema,
      tr = state.tr;

  var markType = schema.marks[markName];
  if (!markType) {
    return false;
  }
  var mathNodeType = schema.nodes[_NodeNames.MATH];
  if (mathNodeType && (0, _isNodeSelectionForNodeType2.default)(selection, mathNodeType)) {
    // A math node is selected.
    return true;
  }

  if (!(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    // Could be a NodeSelection or CellSelection.
    return false;
  }

  var _state$selection = state.selection,
      from = _state$selection.from,
      to = _state$selection.to;


  if (to === from + 1) {
    var node = tr.doc.nodeAt(from);
    if (node.isAtom && !node.isText && node.isLeaf) {
      // An atomic node (e.g. Image) is selected.
      return false;
    }
  }

  return true;
}