const svg = d3.select('svg');
const height = +svg.attr('height');
const width = +svg.attr('width');
const g = svg.append('g')
    .attr('transform',`translate(${ width / 2}, ${ height / 2})`)

const circle = g.append('circle')
    .attr('r',height / 2)
    .attr('fill', 'yellow')
    .attr('stroke','black')

const eyeSpacing = 100;
const eyeYoffset = -80
const eyeRadius = 30;
const eyebrowWidth = 50;
const eyebrowHeight = 10;
const eyebrowYoffset = -150;

const eyesG = g.append('g')
    .attr('transform', `translate(0, ${eyeYoffset})`);

const leftEye = eyesG.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', - eyeSpacing)

const rightEye = eyesG.append('circle')
    .attr('r', eyeRadius)
    .attr('cx', + eyeSpacing)

const mouth = g.append('path')
    .attr('d',d3.arc()({
        innerRadius: 150,
        outerRadius: 170,
        startAngle: Math.PI /2,
        endAngle: Math.PI * 3 / 2
    }))

const BrowG = g.append('g')
    .attr('transform',`translate(${-eyebrowWidth / 2},${eyebrowYoffset})`);
BrowG.transition().duration(2000)
    .attr('transform', `translate(${-eyebrowWidth / 2},${eyebrowYoffset - 50})`)
    .transition().duration(2000)
    .attr('transform', `translate(${-eyebrowWidth / 2},${eyebrowYoffset})`).duration(2000)

const leftEyebrow = BrowG.append('rect')
    .attr('width',eyebrowWidth)
    .attr('height',eyebrowHeight)
    .attr('x',-eyeSpacing)

const rightEyebrow = BrowG.append('rect')
    .attr('width', eyebrowWidth)
    .attr('height', eyebrowHeight)
    .attr('x', eyeSpacing)

