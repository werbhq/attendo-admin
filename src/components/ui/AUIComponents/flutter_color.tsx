function Color(value: number): string {
    const r = (value >> 16) & 0xff;
    const g = (value >> 8) & 0xff;
    const b = value & 0xff;
    const a = (value >> 24) & 0xff;

    return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}${a.toString(16)}`;
}

function mergeColors(colors: string[]): string {
    let r = 0,
        g = 0,
        b = 0,
        a = 0;
    for (const color of colors) {
        const rgba = color
            .match(/#(..)(..)(..)(..)/)
            ?.slice(1)
            .map((hex) => parseInt(hex, 16));
        if (rgba && rgba.length === 4) {
            r += (rgba[0] * rgba[3]) / 255;
            g += (rgba[1] * rgba[3]) / 255;
            b += (rgba[2] * rgba[3]) / 255;
            a += rgba[3];
        }
    }
    const count = colors.length;
    a = a / count;
    if (a === 0) {
        return '#00000000';
    } else {
        r = Math.round(r / a);
        g = Math.round(g / a);
        b = Math.round(b / a);
        return `#${r}${g}${b}${a / 255}`;
    }
}

export { Color, mergeColors };
