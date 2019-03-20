const svg = d3.select('svg');
const height = +svg.attr('height');
const width =  +svg.attr('width');

const render = data => {
    svg.selectAll('rect').data(data)
        .enter().append('rect')
            .attr('width',width)
            .attr('height','200px')
}

const data = d3.csv('./data.csv').then(data => {
    data.forEach(item => {
        item.population = +item.population * 1000
    })
    render(data);
})