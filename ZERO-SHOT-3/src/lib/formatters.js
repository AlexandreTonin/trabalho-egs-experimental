"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCurrency = formatCurrency;
exports.formatPercentage = formatPercentage;
exports.formatDateTime = formatDateTime;
function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}
function formatPercentage(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "percent",
        maximumFractionDigits: 2,
    }).format(value);
}
function formatDateTime(value) {
    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "medium",
    }).format(new Date(value));
}
