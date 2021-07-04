import * as fs from 'fs';
import { Distribution } from './Distribution';
import { Random } from './Random'
import { TriangularDistribution } from './TriangularDistribution';

describe('Output histgram', () => {
    it('triangular distribution', () => {
        const histo = new Histogram(TriangularDistribution.create(-1, 2, 1), 1000000, 100);
        outputHistogram('./dist/histogram.html', histo);
    });
});

class Histogram{

    private labels: number[];
    private data: number[];

    constructor(dist: Distribution, n: number, binCount: number,
                min: number = dist.min(), max: number = dist.max()){
        const delta = (max - min) / binCount;

        this.labels = new Array(binCount);
        for(let i = 0, x = min; i < binCount; i++){
            this.labels[i] = Math.round((x+delta/2)*binCount)/binCount;
            x += delta;
        }

        const dt = new Array<number>(binCount);
        dt.fill(0);
        const rand = dist.random();
        for(let i = 0; i < n; i++){
            const r = rand.next();
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