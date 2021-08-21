import * as fs from 'fs';
import { Distribution } from './Distribution';
import { Stat } from './Distribution.spec';
import { NormalDistribution } from './NormalDistribution';

describe('Output histgram', () => {
    it('triangular distribution', () => {
        const histo = new Histogram(NormalDistribution.create(3, 0.5), 10000000, 1e-2);
        outputHistogram('./dist/histogram.html', histo);
    });
});

class Histogram{

    private labels: number[] = new Array<number>();
    private data: number[] = new Array<number>();

    constructor(dist: Distribution, n: number, delta: number){
        const deltaInv = Math.round(1/delta);
        const stat = new Stat(delta);
        const rand = dist.random();
        for(let i = 0; i < n; i++){
            stat.addData(rand.next());
        }

        const nMin = stat.minIndex();
        const nMax = stat.maxIndex();
        for(let i = nMin; i < nMax; i++){
            const x = stat.x(i);
            this.labels[i-nMin] = Math.round((x+delta/2)*deltaInv)/deltaInv;
            this.data[i-nMin] = stat.frequency(i)/(delta*n);
        }
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