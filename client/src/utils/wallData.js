export const WALLS = (width, height) => {
    const W = 20;
    const marginBottom = 100;
    const cS = "#000";
    const cE = "#777";

    return [
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [W, 0],
                [width - W, 0],
                [width - W, W],
                [W, W],
            ],
            grad: { x1: "0.5", y1: "0", x2: "0.5", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [W, height - marginBottom - W],
                [width - W, height - marginBottom - W],
                [width - W, height - marginBottom],
                [W, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "1", x2: "0.5", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, W],
                [W, W],
                [W, height - marginBottom - W],
                [0, height - marginBottom - W],
            ],
            grad: { x1: "0", y1: "0.5", x2: "1", y2: "0.5" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, W],
                [width, W],
                [width, height - marginBottom - W],
                [width - W, height - marginBottom - W],
            ],
            grad: { x1: "1", y1: "0.5", x2: "0", y2: "0.5" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, 0],
                [W, 0],
                [W, W],
                [0, W],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, 0],
                [width, 0],
                [width, W],
                [width - W, W],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "0", y2: "1" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [0, height - marginBottom - W],
                [W, height - marginBottom - W],
                [W, height - marginBottom],
                [0, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "1", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
        {
            type: "wall",
            renderType: "polygon",
            polygon: [
                [width - W, height - marginBottom - W],
                [width, height - marginBottom - W],
                [width, height - marginBottom],
                [width - W, height - marginBottom],
            ],
            grad: { x1: "0.5", y1: "0.5", x2: "0", y2: "0" },
            colors: { start: cS, end: cE },
            isBuiltin: true,
        },
    ];
};
