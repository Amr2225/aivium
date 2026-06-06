import { ViewPlugin, Decoration, EditorView, ViewUpdate, DecorationSet } from "@codemirror/view";
import { Range } from "@codemirror/state";

// 1. Create the ViewPlugin that scans text and applies a CSS class
export const customTagHighlighter = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = this.getDecorations(view);
    }

    update(update: ViewUpdate): void {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = this.getDecorations(update.view);
      }
    }

    getDecorations(view: EditorView): DecorationSet {
      const builder: Range<Decoration>[] = [];
      const regex = /\{\{\s*(json)\b[^}]*\}\}/g; // Matches '{{json}}' possibly with spaces between braces and 'json'

      for (let { from, to } of view.visibleRanges) {
        const text = view.state.doc.sliceString(from, to);
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
          const jsonOffset = match[0].indexOf(match[1]);
          const start = from + match.index + jsonOffset;
          const end = start + match[1].length;

          // Push decoration matching the position with a custom CSS class name
          builder.push(Decoration.mark({ class: "cm-custom-json-tag" }).range(start, end));
        }
      }
      return Decoration.set(builder);
    }
  },
  {
    decorations: (v) => v.decorations,
  },
);
