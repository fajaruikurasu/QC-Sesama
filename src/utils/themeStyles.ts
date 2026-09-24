import { DesignTheme } from '../types';

export interface ThemeConfig {
  id: DesignTheme;
  name: string;
  shortName: string;
  badge: string;
  stripeClass: string;
  headerBg: string;
  headerSubtext: string;
  headerBadgeBg: string;
  headerBadgeText: string;
  headerBadgeBorder: string;
  navBg: string;
  navActiveTab: string;
  navInactiveTab: string;
  primaryActionBtn: string;
  secondaryActionBtn: string;
  cardRounding: string;
  cardBorder: string;
  cardShadow: string;
  statCardBg: string;
  badgeSD: string;
  badgeSMP: string;
  tableHeaderBg: string;
  accentColorHex: string;
}

export const THEME_CONFIGS: Record<DesignTheme, ThemeConfig> = {
  enterprise: {
    id: 'enterprise',
    name: 'Opsi 1: Pertamina Energy Enterprise',
    shortName: '1. Enterprise',
    badge: 'Resmi BUMN',
    stripeClass: 'h-1.5 w-full bg-gradient-to-r from-[#ED1C24] via-[#84BD00] to-[#005BAC]',
    headerBg: 'bg-gradient-to-r from-[#002D59] via-[#005BAC] to-[#00488B]',
    headerSubtext: 'text-blue-100',
    headerBadgeBg: 'bg-white/15',
    headerBadgeText: 'text-white',
    headerBadgeBorder: 'border-white/30',
    navBg: 'bg-white border-b border-neutral-200',
    navActiveTab: 'bg-[#005BAC] text-white shadow-sm ring-1 ring-[#005BAC]/30',
    navInactiveTab: 'text-neutral-600 hover:text-[#005BAC] hover:bg-blue-50/70',
    primaryActionBtn: 'bg-[#ED1C24] hover:bg-[#D71920] text-white font-bold shadow-sm',
    secondaryActionBtn: 'bg-[#005BAC] hover:bg-[#00488B] text-white font-semibold',
    cardRounding: 'rounded-xl',
    cardBorder: 'border-neutral-200',
    cardShadow: 'shadow-xs hover:shadow-sm',
    statCardBg: 'bg-white border-neutral-200',
    badgeSD: 'bg-red-50 text-[#ED1C24] border-red-200 font-bold',
    badgeSMP: 'bg-blue-50 text-[#005BAC] border-blue-200 font-bold',
    tableHeaderBg: 'bg-neutral-50 border-neutral-200 text-neutral-700',
    accentColorHex: '#005BAC',
  },
  'operational-qc': {
    id: 'operational-qc',
    name: 'Opsi 2: Pertamina Operational QC',
    shortName: '2. Operasional QC',
    badge: 'Industrial QC',
    stripeClass: 'h-1.5 w-full bg-gradient-to-r from-[#ED1C24] via-[#F59E0B] to-[#84BD00]',
    headerBg: 'bg-gradient-to-r from-[#0B132B] via-[#1C2541] to-[#0F172A]',
    headerSubtext: 'text-slate-300',
    headerBadgeBg: 'bg-amber-400/20',
    headerBadgeText: 'text-amber-300',
    headerBadgeBorder: 'border-amber-400/30',
    navBg: 'bg-slate-900 border-b border-slate-800 text-white',
    navActiveTab: 'bg-slate-800 text-amber-300 border border-amber-400/50 shadow-sm font-bold',
    navInactiveTab: 'text-slate-400 hover:text-white hover:bg-slate-800/60',
    primaryActionBtn: 'bg-[#D71920] hover:bg-[#B91C1C] text-white font-black uppercase tracking-wider shadow-sm',
    secondaryActionBtn: 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold',
    cardRounding: 'rounded-lg',
    cardBorder: 'border-slate-300',
    cardShadow: 'shadow-sm',
    statCardBg: 'bg-white border-slate-300',
    badgeSD: 'bg-red-100 text-red-800 border-red-300 font-bold',
    badgeSMP: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
    tableHeaderBg: 'bg-slate-100 border-slate-300 text-slate-800 font-bold',
    accentColorHex: '#D71920',
  },
  'eco-modern': {
    id: 'eco-modern',
    name: 'Opsi 3: Pertamina CSR Eco-Modern',
    shortName: '3. CSR Eco-Modern',
    badge: 'CSR Peduli',
    stripeClass: 'h-1.5 w-full bg-gradient-to-r from-[#84BD00] via-[#00A3E0] to-[#005BAC]',
    headerBg: 'bg-gradient-to-r from-[#005BAC] via-[#007EA7] to-[#00A896]',
    headerSubtext: 'text-teal-50',
    headerBadgeBg: 'bg-white/20',
    headerBadgeText: 'text-white',
    headerBadgeBorder: 'border-white/30',
    navBg: 'bg-white border-b border-emerald-100',
    navActiveTab: 'bg-gradient-to-r from-[#84BD00] to-[#6DA700] text-white shadow-sm font-bold',
    navInactiveTab: 'text-neutral-600 hover:text-emerald-700 hover:bg-emerald-50/70',
    primaryActionBtn: 'bg-gradient-to-r from-[#84BD00] to-[#6DA700] hover:brightness-105 text-white font-bold shadow-sm',
    secondaryActionBtn: 'bg-[#005BAC] hover:bg-[#00488B] text-white font-semibold',
    cardRounding: 'rounded-2xl',
    cardBorder: 'border-emerald-100',
    cardShadow: 'shadow-xs hover:shadow-md',
    statCardBg: 'bg-white border-emerald-100',
    badgeSD: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    badgeSMP: 'bg-sky-50 text-sky-800 border-sky-200 font-bold',
    tableHeaderBg: 'bg-emerald-50/50 border-emerald-200 text-emerald-950 font-bold',
    accentColorHex: '#84BD00',
  },
};
