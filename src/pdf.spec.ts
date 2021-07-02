import * as fs from 'fs';
import { Random } from './Random'
import { TriangularRandom } from './TriangularRandom'
import { MSequenceRandom } from './MSequenceRandom';

describe('Output pdf', () => {
    it('triangular distribution', () => {
        outputPdf('./dist/pdf.html', new MSequenceRandom());
    });
});

function outputPdf(file: string, rand: Random){
    const n = 100;
    const delta = (rand.max() - rand.min())/n;
    const data = new Array<{x: number, y: number}>();
    for(let x = rand.min(); x < rand.max(); x+=delta){
        data.push({x: x, y: rand.pdf(x)});
    }

    const content =
        '<!DOCTYPE html>\n' +
        '<html>\n' +
        '<head>\n' +
        '  <meta charset="UTF-8">\n' +
        '  <title>PDF</title>\n' +
        '  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n' +
        '</head>\n' +
        '<body>\n' +
        '  <div><canvas id="pdf" width="400" height="150"></canvas><\div>\n' +
        '  <script>\n' +
        '    const labels = [' + data.map(d => `"${Math.floor(d.x*n)/n}"`).join(',') + '];\n' +
        '    const data = {\n' +
        '      labels: labels,\n' +
        '      datasets: [{\n' +
        '        backgroundColor: "rgb(255, 99, 132)",\n' +
        '        borderColor: "rgb(255, 99, 132)",\n' +
        '        data: [' + data.map(d => d.y.toString()).join(',') + ']\n' +
        '      }]\n' +
        '    };\n' +
        '    \n' +
        '    const config = {\n' +
        '      type: "line",\n' +
        '      data,\n' +
        '      options: {\n' +
        '        scales: {\n' +
        '          y: { beginAtZero: true }\n' +
        '        }\n' +
        '      }\n' +
        '    };\n' +
        '    \n' +
        '    var pdf = new Chart(\n' +
        '      document.getElementById("pdf"),\n' +
        '      config\n' +
        '    );\n' +
        '  </script>\n' +
        '</body>\n' +
        '</html>\n';

    fs.writeFile(file, content,
        error => { if(error) console.error('error writing!', error)});
}