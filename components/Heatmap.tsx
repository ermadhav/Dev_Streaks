import { View, Text } from "react-native";
import React from "react";

type HeatmapProps = {
  data?: number[];
  containerWidth?: number;
};

const ROWS = 7;
const GAP = 4;
const MIN_CELL = 12;
const FALLBACK_WIDTH = 300;

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function Heatmap({
  data = [],
  containerWidth = FALLBACK_WIDTH,
}: HeatmapProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const width = containerWidth > 0 ? containerWidth : FALLBACK_WIDTH;

  const columns = Math.max(
    1,
    Math.floor((width + GAP) / (MIN_CELL + GAP))
  );

  const cellSize =
    (width - GAP * (columns - 1)) / columns;

  if (!Number.isFinite(cellSize) || cellSize <= 0) {
    return null;
  }

  // Hide month labels on very small cells
  const showMonthLabels = cellSize >= 14;

  const visibleData = data.slice(-columns * ROWS);

  /* ---------- BUILD GRID ---------- */
  const grid: number[][] = [];
  for (let c = 0; c < columns; c++) {
    grid.push(
      visibleData.slice(c * ROWS, c * ROWS + ROWS)
    );
  }

  /* ---------- BUILD MONTH LABELS ---------- */
  const labels: (string | null)[] = [];
  if (showMonthLabels) {
    const startDate = new Date();
    startDate.setUTCDate(
      startDate.getUTCDate() - visibleData.length + 1
    );

    let lastMonth = -1;

    for (let c = 0; c < columns; c++) {
      const weekStart = new Date(startDate);
      weekStart.setUTCDate(startDate.getUTCDate() + c * 7);

      const month = weekStart.getUTCMonth();
      if (month !== lastMonth) {
        labels.push(MONTHS[month]);
        lastMonth = month;
      } else {
        labels.push(null);
      }
    }
  }

  return (
    <View>
      {/* ---------- MONTH LABELS ---------- */}
      {showMonthLabels && (
        <View
          style={{
            flexDirection: "row",
            marginBottom: 6,
          }}
        >
          {labels.map((label, i) => (
            <View
              key={i}
              style={{
                width: cellSize + GAP,
                alignItems: "center",
              }}
            >
              {label && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  {label}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ---------- HEATMAP GRID (NO GAP) ---------- */}
      <View style={{ flexDirection: "row" }}>
        {grid.map((col, colIndex) => (
          <View
            key={colIndex}
            style={{
              marginRight: colIndex !== grid.length - 1 ? GAP : 0,
            }}
          >
            {col.map((value, rowIndex) => (
              <View
                key={rowIndex}
                style={{
                  width: cellSize,
                  height: cellSize,
                  borderRadius: 4,
                  backgroundColor: getHeatColor(value),
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.08)",
                  marginBottom:
                    rowIndex !== col.length - 1 ? GAP : 0,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

/* ---------- COLOR SCALE ---------- */
function getHeatColor(value: number) {
  if (value <= 0) return "#374151";
  if (value < 3) return "#14532d";
  if (value < 6) return "#166534";
  if (value < 10) return "#22c55e";
  return "#4ade80";
}
