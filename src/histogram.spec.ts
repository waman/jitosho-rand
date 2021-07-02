import * as fs from 'fs';
import { MSequenceRandom } from './MSequenceRandom';
import { Random } from './Random'
import { TriangularRandom } from './TriangularRandom'

describe('Output histgram', () => {
    it('triangular distribution', () => {
        const histo = new Histogram(new MSequenceRandom(), 1000000, 100);
        outputHistogram('./dist/histogram.html', histo);
    });
});

class Histogram{

    private labels: number[];
    private data: number[];

    constructor(rng: Random, n: number, binCount: number,
                min: number = rng.min(), max: number = rng.max()){
        const delta = (max - min) / binCount;

        this.labels = new Array(binCount);
        for(let i = 0, x = min; i < binCount; i++){
            this.labels[i] = Math.round((x+delta/2)*binCount)/binCount;
            x += delta;
        }

        const dt = new Array<number>(binCount);
        dt.fill(0);
        for(let i = 0; i < n; i++){
            const r = rng.next();
            const t = Math.floor((r - min)/delta);
            dt[t]++;
        }
        this.data = dt.map(y => y/(delta*n));
    }

    getLabels(): number[]{
        return this.labels;
    }

    getData(): number[]{
        return this.data;
    }
}

function outputHistogram(file: string, histo: Histogram){
    const content =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '  <meta charset="UTF-8">\n' +
        '  <title>Histogram</title>\n' +
        '  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n' +
        '</head>\n' +
        '<body>\n' +
        '  <div><canvas id="histogram" width="400" height="150"></canvas><\div>\n' +
        '  <script>\n' +
        '    const labels = [' + histo.getLabels().map(x => `"${x}"`).join(',') + '];\n' +
        '    const data = {\n' +
        '      labels: labels,\n' +
        '      datasets: [{\n' +
        '        backgroundColor: "rgb(255, 99, 132)",\n' +
        '        borderColor: "rgb(255, 99, 132)",\n' +
        '        data: [' + histo.getData().map(x => `${x}`).join(',') + ']\n' +
        '      }]\n' +
        '    };\n' +
        '    \n' +
        '    const config = {\n' +
        '      type: "bar",\n' +
        '      data,\n' +
        '      options: {\n' +
        '        scales: {\n' +
        '          y: { beginAtZero: true }\n' +
        '        }\n' +
        '      }\n' +
        '    };\n' +
        '    \n' +
        '    var histogram = new Chart(\n' +
        '      document.getElementById("histogram"),\n' +
        '      config\n' +
        '    );\n' +
        '  </script>\n' +
        '</body>\n' +
        '</html>\n';

    fs.writeFile(file, content,
        error => { if(error) console.error('error writing!', error)});
}