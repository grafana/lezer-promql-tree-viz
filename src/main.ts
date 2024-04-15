import {graphviz, wasmFolder} from "@hpcc-js/wasm";
import {SyntaxNode, Tree} from "@lezer/common";
import * as lezerLogQL from '@prometheus-io/lezer-promql'

wasmFolder("https://cdn.jsdelivr.net/npm/@hpcc-js/wasm/dist");

const dot = "digraph G { Hello -> World }";

let currentlyVisualizedText = '';
let currentlyVisualizedPos = 0;

graphviz.dot(dot).then(svg => {
    const inElem = document.querySelector('#in') as HTMLTextAreaElement;
    const graphViz = document.getElementById("out") ?? new HTMLElement();
    const cursorPosElem = document.querySelector('#cursor-pos') ?? new HTMLElement();
    graphViz.innerHTML = svg;

    inElem.focus();
    inElem.setSelectionRange(25, 25);

    function getNodeText(node: SyntaxNode) {
        const prefix = node.type.isError ? 'ERROR' : node.name;
        //@ts-ignore
        return `${prefix}_${node.index}__${node.from}_${node.to}`;
    }

    function getGraphLine(node: SyntaxNode) {
        const nodeText = getNodeText(node);
        if (node.parent != null) {
            const parentText = getNodeText(node.parent);
            return `${parentText}->${nodeText}`;
        }
    }

    function render() {
        const text = inElem.value;
        const pos = inElem.selectionStart;

        if (text === currentlyVisualizedText && pos === currentlyVisualizedPos) {
            // no changes
            return;
        }

        const tree: Tree = lezerLogQL.parser.parse(text);
        const cur = tree.cursor(0);
        const graphLines = [];
        graphLines.push(getGraphLine(cur.node));
        while (cur.next()) {
            graphLines.push(getGraphLine(cur.node));
        }

        // const posCur = tree.cursor(pos);

        //@ts-ignore
        const nodeText = getNodeText(tree.cursor(pos));

        const graphText = `digraph {
              ${graphLines.join('\n')}
              ${nodeText} [style=filled]
            }`.trim();


        graphviz.dot(graphText).then(svg => {
            graphViz.innerHTML = svg;

            currentlyVisualizedText = text;
            currentlyVisualizedPos = pos;

            cursorPosElem.innerHTML = pos.toString();
        })
    }

    render();

    inElem.addEventListener('keyup', render);
    inElem.addEventListener('click', render);
});

