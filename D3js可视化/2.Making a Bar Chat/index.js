const svg = d3.select('svg');
const height = +svg.attr('height');
const width =  +svg.attr('width');
const margin = {left:80,top:10,right:20,bottom:30};
const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const render = data => {
    
    const xValue = d => d.population;
    const yValue = d => d.country;
    
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data,xValue)])
        .range([0, innerWidth]) //最大值将视图空间充满
    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.15)
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)
    g.selectAll('rect').data(data)  //选择`rect`并绑定数据data，但这个时候没有元素，因此使用enter
        .enter().append('rect')
        .attr('y',d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height',yScale.bandwidth())
    g.append('g').call(d3.axisLeft(yScale));
    g.append('g').call(d3.axisBottom(xScale))
        .attr('transform',`translate(0,${innerHeight})`)
}

const data = d3.csv('./data.csv').then(data => {
    data.forEach(item => {
        item.population = +item.population * 1000
    })
    render(data);
})