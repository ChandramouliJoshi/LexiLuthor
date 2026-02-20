
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VectorPoint } from '../types';
import { COLORS } from '../constants';

interface VectorSpaceProps {
  points: VectorPoint[];
}

const VectorSpace: React.FC<VectorSpaceProps> = ({ points }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || points.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = 60;

    const xScale = d3.scaleLinear()
      .domain([-120, 120])
      .range([padding, width - padding]);

    const yScale = d3.scaleLinear()
      .domain([-120, 120])
      .range([height - padding, padding]);

    // Draw Grid
    const g = svg.append('g').attr('class', 'grid');
    
    // Axis lines
    g.append('line')
      .attr('x1', xScale(-120)).attr('y1', yScale(0))
      .attr('x2', xScale(120)).attr('y2', yScale(0))
      .attr('stroke', '#1e293b').attr('stroke-width', 1);
    
    g.append('line')
      .attr('x1', xScale(0)).attr('y1', yScale(-120))
      .attr('x2', xScale(0)).attr('y2', yScale(120))
      .attr('stroke', '#1e293b').attr('stroke-width', 1);

    // Definitions for markers (arrows)
    const defs = svg.append('defs');
    Object.entries(COLORS).forEach(([key, color]) => {
      defs.append('marker')
        .attr('id', `arrowhead-${key}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color);
    });

    // Draw vectors from origin
    points.forEach(p => {
      const color = p.type === 'base' ? COLORS.a : 
                   p.type === 'subtract' ? COLORS.b :
                   p.type === 'add' ? COLORS.c : COLORS.result;
      
      const key = p.type === 'base' ? 'a' : 
                  p.type === 'subtract' ? 'b' :
                  p.type === 'add' ? 'c' : 'result';

      svg.append('line')
        .attr('x1', xScale(0))
        .attr('y1', yScale(0))
        .attr('x2', xScale(p.x))
        .attr('y2', yScale(p.y))
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', p.type === 'result' ? 'none' : '4,2')
        .attr('opacity', 0.6)
        .attr('marker-end', `url(#arrowhead-${key})`);
    });

    // Draw points and labels
    const node = svg.append('g')
      .selectAll('g')
      .data(points)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

    node.append('circle')
      .attr('r', 6)
      .attr('fill', d => {
        if (d.type === 'base') return COLORS.a;
        if (d.type === 'subtract') return COLORS.b;
        if (d.type === 'add') return COLORS.c;
        return COLORS.result;
      })
      .attr('filter', 'drop-shadow(0 0 8px rgba(0,0,0,0.5))');

    node.append('text')
      .text(d => d.word.toUpperCase())
      .attr('x', 12)
      .attr('y', 4)
      .attr('fill', '#f8fafc')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('font-family', 'JetBrains Mono')
      .attr('class', 'pointer-events-none');

    // Draw arithmetic lines (parallelogram hints)
    // Concept: A -> (A - B) -> (A - B + C)
    const pA = points.find(p => p.type === 'base');
    const pB = points.find(p => p.type === 'subtract');
    const pC = points.find(p => p.type === 'add');
    const pR = points.find(p => p.type === 'result');

    if (pA && pB && pC && pR) {
        // Line from B to A (represents Vector A - B if origin was B)
        svg.append('line')
          .attr('x1', xScale(pB.x))
          .attr('y1', yScale(pB.y))
          .attr('x2', xScale(pA.x))
          .attr('y2', yScale(pA.y))
          .attr('stroke', '#64748b')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.5);

        // Line from C to R (represents Vector Result - C if origin was C)
        svg.append('line')
          .attr('x1', xScale(pC.x))
          .attr('y1', yScale(pC.y))
          .attr('x2', xScale(pR.x))
          .attr('y2', yScale(pR.y))
          .attr('stroke', '#64748b')
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '5,5')
          .attr('opacity', 0.5);
    }

  }, [points]);

  return (
    <div className="w-full h-full min-h-[400px] relative bg-slate-900/50 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="absolute top-4 left-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
        Simulated 2D Projection
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

export default VectorSpace;
