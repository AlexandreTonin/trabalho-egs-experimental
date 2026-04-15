'use client';

import { useEffect, useState } from 'react';
import { listCreditLogs, registerCreditAnalysis } from '@/services/creditAnalysisService';
import { CreditAnalysisResult, CreditFormData, CreditLog } from '@/types/credit';

const initialFormData: CreditFormData = {
  age: 18,
  monthlyIncome: 3000,
  debtHistory: 'limpo',
  loanAmount: 1200,
};

// Camada UI: hook de interface para coordenar estado e eventos da tela.
export function useCreditAnalysis() {
  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState<CreditAnalysisResult | null>(null);
  const [logs, setLogs] = useState<CreditLog[]>([]);
  useEffect(loadLogsOnClient, []);
  return { formData, logs, result, submitAnalysis, updateDebtHistory, updateNumberField };

  function loadLogsOnClient() { setLogs(listCreditLogs()); }
  function updateNumberField(name: NumberFieldName, value: string) { setFormData((current) => ({ ...current, [name]: Number(value) })); }
  function updateDebtHistory(value: CreditFormData['debtHistory']) { setFormData((current) => ({ ...current, debtHistory: value })); }
  function submitAnalysis() { setResult(registerCreditAnalysis(formData)); setLogs(listCreditLogs()); }
}

type NumberFieldName = 'age' | 'monthlyIncome' | 'loanAmount';
