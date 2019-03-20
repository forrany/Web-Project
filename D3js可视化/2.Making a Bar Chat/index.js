const svg = d3.select('svg');
const height = +svg.attr('height');
const width =  +svg.attr('width');

const render = data => {
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([0, width]) //最大值将视图空间充满
    const yScale = d3.scaleBand()
        .domain(data.map(d => d.country))
        .range([0, height])

    svg.selectAll('rect').data(data)  //选择`rect`并绑定数据data，但这个时候没有元素，因此使用enter
        .enter().append('rect')
        .attr('y',d => yScale(d.country))
        .attr('width', d => xScale(d.population))
        .attr('height',yScale.bandwidth())
}

const data = d3.csv('./data.csv').then(data => {
    data.forEach(item => {
        item.population = +item.population * 1000
    })
    render(data);
})