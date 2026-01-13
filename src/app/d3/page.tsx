"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data } from "@/db/data";
import Link from "next/link";

const D3Page = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const teams = Object.keys(data);
    const n = teams.length;

    const matrix = teams.map((rowTeam) => teams.map((colTeam) => (rowTeam === colTeam ? 0 : data[rowTeam]?.[colTeam]?.W ?? 0)));
    const lossMatrix = teams.map((rowTeam) => teams.map((colTeam) => (rowTeam === colTeam ? 0 : data[rowTeam]?.[colTeam]?.L ?? 0)));
    const teamTotals = teams.map((_, i) => ({
      wins: d3.sum(matrix[i]),
      losses: d3.sum(lossMatrix[i]),
    }));

    const width = 640;
    const height = 640;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 18;

    const svg = d3.select(containerRef.current).append("svg").attr("width", width).attr("height", height);

    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);

    const defaultLabel = "";

    const color = d3.scaleOrdinal<string, string>().domain(teams).range(d3.schemeTableau10.concat(d3.schemeSet3).slice(0, n));

    const chord = d3.chord().padAngle(0.06).sortSubgroups(d3.descending).sortChords(d3.descending);

    const chords = chord(matrix);

    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    const ribbon = d3.ribbon().radius(innerRadius);

    const group = g.append("g").selectAll("g").data(chords.groups).join("g");

    const groupPaths = group
      .append("path")
      .attr("d", arc as unknown as string)
      .attr("fill", (d) => color(teams[d.index]))
      .attr("stroke", "#000")
      .attr("stroke-width", 1);

    group
      .append("text")
      .each((d) => {
        d.angle = (d.startAngle + d.endAngle) / 2;
      })
      .attr("dy", "0.35em")
      .attr("transform", (d) => {
        const rotate = (d.angle * 180) / Math.PI - 90;
        const translate = outerRadius + 14;
        return `rotate(${rotate}) translate(${translate}) ${d.angle > Math.PI ? "rotate(180)" : ""}`;
      })
      .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : "start"))
      .style("font-family", "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif")
      .style("font-size", "12px")
      .text((d) => teams[d.index]);

    const ribbonGroup = g.append("g").attr("fill-opacity", 0.75);
    const ribbonPaths = ribbonGroup
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("d", ribbon as unknown as string)
      .attr("fill", (d) => color(teams[d.source.index]))
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5);

    ribbonPaths.append("title").text((d) => {
      const src = teams[d.source.index];
      const tgt = teams[d.target.index];
      const w = matrix[d.source.index][d.target.index];
      const l = lossMatrix[d.source.index][d.target.index];
      return `${src} vs ${tgt}: ${w}-${l}`;
    });

    const centerLabel = g.append("text").attr("text-anchor", "middle").attr("y", 0).style("font-family", "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif").style("font-size", "13px").text(defaultLabel);

    const resetHighlight = () => {
      groupPaths.attr("opacity", 1).attr("stroke-width", 1);
      ribbonPaths.attr("opacity", 1);
      centerLabel.text(defaultLabel);
    };

    const showTeamRecord = (index: number) => {
      const team = teams[index];
      const record = teamTotals[index];
      centerLabel.text(`${team} record: ${record.wins}-${record.losses}`);
    };

    const showMatchupRecord = (srcIndex: number, tgtIndex: number) => {
      const src = teams[srcIndex];
      const tgt = teams[tgtIndex];
      const record = data[src]?.[tgt];
      if (record) {
        centerLabel.text(`${src} vs ${tgt}: ${record.W}-${record.L}`);
        return;
      }
      centerLabel.text(`${src} vs ${tgt}`);
    };

    group
      .on("mouseover", function (event, d) {
        const index = d.index;
        groupPaths.attr("opacity", 0.25).attr("stroke-width", 1);
        d3.select(this).select("path").attr("opacity", 1).attr("stroke-width", 2);
        ribbonPaths.attr("opacity", (r) => (r.source.index === index || r.target.index === index ? 0.9 : 0.05));
        showTeamRecord(index);
      })
      .on("mouseout", resetHighlight);

    ribbonPaths
      .on("mouseover", function (event, d) {
        ribbonPaths.attr("opacity", 0.1);
        d3.select(this).attr("opacity", 1);
        groupPaths.attr("opacity", 0.25).attr("stroke-width", 1);
        groupPaths
          .filter((g) => g.index === d.source.index || g.index === d.target.index)
          .attr("opacity", 1)
          .attr("stroke-width", 2);
        showMatchupRecord(d.source.index, d.target.index);
      })
      .on("mouseout", resetHighlight);
  }, []);

  return (
    <>
      <div id="my_dataviz" ref={containerRef} />
      <Link href="/table2" className="mt-4 inline-block text-sm underline hover:no-underline">
        Back
      </Link>
    </>
  );
};

export default D3Page;
