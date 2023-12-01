export function progressOverTime(data) {

    // Dimensions and margins for the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 700 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    // Append the SVG object to the body of the page
    const svg = d3.select('.chart-container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    // Add X axis
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => new Date(d.createdAt)))
        .range([0, width]);
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.cumulativeXP)])
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));

    // Add the line
    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('d', d3.line()
            .x(d => x(new Date(d.createdAt)))
            .y(d => y(d.cumulativeXP))
        );

    // Create a tooltip
    const tooltip = d3.select('.chart-container')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')
        .style('background-color', 'white')
        .style('border', 'solid')
        .style('border-width', '2px')
        .style('border-radius', '5px')
        .style('padding', '5px');

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        tooltip.style('opacity', 1);
    };
    const mousemove = function (event, d) {
        const [x, y] = d3.pointer(event, svg.node()); // Get cursor position relative to the SVG container
        const pathParts = d.path.split('/');
        const projectName = pathParts[pathParts.length - 1];
        tooltip.html(`Name: ${projectName}<br>XP Gained: ${formatXP(d.amount)}<br>Date: ${new Date(d.createdAt).toLocaleDateString('en-GB')}`)
            .style('left', (x + 250) + 'px') // Position tooltip slightly right of the cursor
            .style('top', (y - 50) + 'px'); // Position tooltip slightly below the cursor
    };
    const mouseleave = function (event, d) {
        tooltip.style('opacity', 0);
    };

    // Add the points with the tooltips
    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(new Date(d.createdAt)))
        .attr('cy', d => y(d.cumulativeXP))
        .attr('r', 5)
        .attr('fill', '#69b3a2')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
}

function formatXP(xp) {
    if (xp >= 1e6) {
        return (xp / 1e6).toFixed(2) + ' MB';
    } else if (xp >= 1000) {
        return (xp / 1000).toFixed(2) + ' kB';
    } else {
        return xp + ' XP';
    }
}
