"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

type PeriodType = "day" | "week" | "month";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface PeriodFilterProps {
  currentPeriod: PeriodType;
  dateRange: DateRange;
  onPeriodChange: (period: PeriodType, dateRange: DateRange) => void;
}

const PeriodFilter = ({
  currentPeriod,
  dateRange,
  onPeriodChange,
}: PeriodFilterProps) => {
  const getLocalDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 🔥 NUEVA función segura para parsear fechas locales
  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDateRange = (
    period: PeriodType,
    baseDate?: string,
  ): DateRange => {
    const today = baseDate ? parseLocalDate(baseDate) : new Date();

    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    let startDate: Date;
    let endDate: Date;

    if (period === "day") {
      startDate = new Date(year, month, date);
      endDate = new Date(year, month, date);
    } else if (period === "week") {
      const dayOfWeek = today.getDay();
      const diff = date - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

      startDate = new Date(year, month, diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      // month
      startDate = new Date(year, month, 1);
      endDate = new Date(year, month + 1, 0);
    }

    return {
      startDate: formatDateToString(startDate),
      endDate: formatDateToString(endDate),
    };
  };

  const formatDateDisplay = (dateString: string): string => {
    const date = parseLocalDate(dateString);

    return date.toLocaleDateString("es-ES", {
      month: "short",
      day: "numeric",
    });
  };

  const handlePeriodSelect = (period: PeriodType) => {
    const range = calculateDateRange(period);
    onPeriodChange(period, range);
  };

  const handleNavigation = (direction: "prev" | "next") => {
    const startDate = parseLocalDate(dateRange.startDate);
    let newDate: Date;

    if (currentPeriod === "day") {
      newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (currentPeriod === "week") {
      newDate = new Date(startDate);
      newDate.setDate(startDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate = new Date(startDate);
      newDate.setMonth(startDate.getMonth() + (direction === "next" ? 1 : -1));
    }

    const range = calculateDateRange(
      currentPeriod,
      formatDateToString(newDate),
    );

    onPeriodChange(currentPeriod, range);
  };

  const handleToday = () => {
    const range = calculateDateRange(currentPeriod, getLocalDateString());
    onPeriodChange(currentPeriod, range);
  };

  const periodLabels: Record<PeriodType, string> = {
    day: "Día",
    week: "Semana",
    month: "Mes",
  };

  const getDisplayText = (): string => {
    if (currentPeriod === "day") {
      return formatDateDisplay(dateRange.startDate);
    } else if (currentPeriod === "week") {
      return `${formatDateDisplay(dateRange.startDate)} - ${formatDateDisplay(dateRange.endDate)}`;
    } else {
      const date = parseLocalDate(dateRange.startDate);

      return date.toLocaleDateString("es-ES", {
        month: "long",
        year: "numeric",
      });
    }
  };

  useEffect(() => {
    if (!dateRange.startDate) {
      const range = calculateDateRange(currentPeriod);
      onPeriodChange(currentPeriod, range);
    }
  }, []);

  return (
    <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-blue-50/50 rounded-lg border border-blue-200/50 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-gray-900">
            Filtrar citas por período
          </h3>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(["day", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodSelect(period)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                currentPeriod === period
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              {periodLabels[period]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 justify-between">
          <button
            onClick={() => handleNavigation("prev")}
            className="p-1.5 hover:bg-white rounded-md transition-colors"
            aria-label="Período anterior"
          >
            <ChevronLeft className="size-4 text-gray-600" />
          </button>

          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-gray-900">
              {getDisplayText()}
            </p>
          </div>

          <button
            onClick={() => handleNavigation("next")}
            className="p-1.5 hover:bg-white rounded-md transition-colors"
            aria-label="Período siguiente"
          >
            <ChevronRight className="size-4 text-gray-600" />
          </button>

          <Button
            onClick={handleToday}
            variant="outline"
            size="sm"
            className="shrink-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
          >
            Actual
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PeriodFilter;
