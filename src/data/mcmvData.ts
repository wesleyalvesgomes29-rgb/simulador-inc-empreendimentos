import { McmvBracket, McmvSimulationResult } from '../types';

/**
 * TABELA OFICIAL MCMV - UBERLÂNDIA/MG (04/2026 - Associativo CAIXA - Planta - PRICE)
 * 
 * FONTE DE VERDADE OFICIAL:
 * - 420 Meses
 * - Perfis: Cotista/Não Cotista x Com/Sem Dependente + Classe Média
 * - Total de Registros Importados: 211
 */

interface RawRow {
  renda: number;
  fin: number;
  sub: number;
  par: number;
  taxa: number;
}

// 51 linhas de renda para cada perfil do MCMV
const INCOME_POINTS = [
  1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 
  2500, 2600, 2700, 2800, 2900, 3000, 3100, 3200, 3300, 3400, 
  3500, 3600, 3700, 3800, 3900, 4000, 4100, 4200, 4300, 4400, 
  4500, 4700, 4800, 4900, 5000, 5100, 5200, 5300, 5400, 5500, 
  5600, 5700, 5800, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9600
];

// Helper to deduce MCMV Faixa label
function getFaixaLabel(renda: number): 'Faixa 1' | 'Faixa 2' | 'Faixa 3' | 'Classe Média' {
  if (renda <= 2640) return 'Faixa 1';
  if (renda <= 4400) return 'Faixa 2';
  if (renda <= 9600) return 'Faixa 3';
  return 'Classe Média';
}

// 1. COTISTA / COM DEPENDENTE (51 registros)
const DATA_COT_DEP: RawRow[] = [
  { renda: 1500, fin: 92072.96, sub: 55000.00, par: 449.99, taxa: 4.33 },
  { renda: 1600, fin: 98473.73, sub: 55000.00, par: 479.99, taxa: 4.33 },
  { renda: 1700, fin: 104874.50, sub: 55000.00, par: 509.99, taxa: 4.33 },
  { renda: 1800, fin: 111275.27, sub: 53588.00, par: 539.99, taxa: 4.33 },
  { renda: 1900, fin: 117676.05, sub: 47728.00, par: 569.99, taxa: 4.33 },
  { renda: 2000, fin: 124076.82, sub: 42274.00, par: 599.99, taxa: 4.33 },
  { renda: 2100, fin: 130477.59, sub: 37216.00, par: 629.99, taxa: 4.33 },
  { renda: 2200, fin: 132534.06, sub: 32840.00, par: 659.99, taxa: 4.59 },
  { renda: 2300, fin: 138731.68, sub: 28519.00, par: 689.99, taxa: 4.59 },
  { renda: 2400, fin: 144929.30, sub: 24561.00, par: 719.99, taxa: 4.59 },
  { renda: 2500, fin: 151126.92, sub: 20958.00, par: 749.99, taxa: 4.59 },
  { renda: 2600, fin: 157324.54, sub: 17699.00, par: 779.99, taxa: 4.59 },
  { renda: 2700, fin: 163522.16, sub: 14774.00, par: 809.99, taxa: 4.59 },
  { renda: 2800, fin: 169719.78, sub: 12172.00, par: 839.99, taxa: 4.59 },
  { renda: 2900, fin: 165421.67, sub: 10007.00, par: 869.99, taxa: 4.85 },
  { renda: 3000, fin: 171425.80, sub: 8004.00, par: 899.99, taxa: 4.85 },
  { renda: 3100, fin: 177430.07, sub: 6260.00, par: 930.00, taxa: 4.85 },
  { renda: 3200, fin: 183434.20, sub: 4845.00, par: 960.00, taxa: 4.85 },
  { renda: 3300, fin: 183620.53, sub: 3757.00, par: 990.00, taxa: 5.11 },
  { renda: 3400, fin: 189440.27, sub: 2872.00, par: 1020.00, taxa: 5.11 },
  { renda: 3500, fin: 195260.01, sub: 2244.00, par: 1050.00, taxa: 5.11 },
  { renda: 3600, fin: 189213.16, sub: 1919.00, par: 1080.00, taxa: 5.64 },
  { renda: 3700, fin: 194689.45, sub: 1777.00, par: 1110.00, taxa: 5.64 },
  { renda: 3800, fin: 200165.74, sub: 1762.00, par: 1140.00, taxa: 5.64 },
  { renda: 3900, fin: 205642.04, sub: 1170.00, par: 1170.00, taxa: 5.64 },
  { renda: 4000, fin: 208000.00, sub: 1762.00, par: 1182.91, taxa: 5.64 },
  { renda: 4100, fin: 192947.76, sub: 0.00, par: 1230.00, taxa: 6.69 },
  { renda: 4200, fin: 197826.17, sub: 0.00, par: 1260.00, taxa: 6.69 },
  { renda: 4300, fin: 202704.59, sub: 0.00, par: 1290.00, taxa: 6.69 },
  { renda: 4400, fin: 207583.00, sub: 0.00, par: 1320.00, taxa: 6.69 },
  { renda: 4500, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4700, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4800, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4900, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 5000, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 5100, fin: 212002.26, sub: 0.00, par: 1530.00, taxa: 7.93 },
  { renda: 5200, fin: 216309.50, sub: 0.00, par: 1560.00, taxa: 7.93 },
  { renda: 5300, fin: 220616.73, sub: 0.00, par: 1590.00, taxa: 7.93 },
  { renda: 5400, fin: 224923.97, sub: 0.00, par: 1620.00, taxa: 7.93 },
  { renda: 5500, fin: 229231.21, sub: 0.00, par: 1650.00, taxa: 7.93 },
  { renda: 5600, fin: 233538.45, sub: 0.00, par: 1680.00, taxa: 7.93 },
  { renda: 5700, fin: 237845.69, sub: 0.00, par: 1710.00, taxa: 7.93 },
  { renda: 5800, fin: 242152.92, sub: 0.00, par: 1740.00, taxa: 7.93 },
  { renda: 6000, fin: 250767.40, sub: 0.00, par: 1800.00, taxa: 7.93 },
  { renda: 6500, fin: 272303.59, sub: 0.00, par: 1950.00, taxa: 7.93 },
  { renda: 7000, fin: 293839.78, sub: 0.00, par: 2100.00, taxa: 7.93 },
  { renda: 7500, fin: 315375.97, sub: 0.00, par: 2250.00, taxa: 7.93 },
  { renda: 8000, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 8500, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 9000, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 9600, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
];

// 2. COTISTA / SEM DEPENDENTE (51 registros)
const DATA_COT_SDEP: RawRow[] = [
  { renda: 1500, fin: 92072.96, sub: 16500.00, par: 449.99, taxa: 4.33 },
  { renda: 1600, fin: 98473.73, sub: 16500.00, par: 479.99, taxa: 4.33 },
  { renda: 1700, fin: 104874.50, sub: 16500.00, par: 509.99, taxa: 4.33 },
  { renda: 1800, fin: 111275.27, sub: 16076.00, par: 539.99, taxa: 4.33 },
  { renda: 1900, fin: 117676.05, sub: 14318.00, par: 569.99, taxa: 4.33 },
  { renda: 2000, fin: 124076.82, sub: 12682.00, par: 599.99, taxa: 4.33 },
  { renda: 2100, fin: 130477.59, sub: 11164.00, par: 629.99, taxa: 4.33 },
  { renda: 2200, fin: 132534.06, sub: 9852.00, par: 659.99, taxa: 4.59 },
  { renda: 2300, fin: 138731.68, sub: 8555.00, par: 689.99, taxa: 4.59 },
  { renda: 2400, fin: 144929.30, sub: 7368.00, par: 719.99, taxa: 4.59 },
  { renda: 2500, fin: 151126.92, sub: 6287.00, par: 749.99, taxa: 4.59 },
  { renda: 2600, fin: 157324.54, sub: 5309.00, par: 779.99, taxa: 4.59 },
  { renda: 2700, fin: 163522.16, sub: 4432.00, par: 809.99, taxa: 4.59 },
  { renda: 2800, fin: 169719.78, sub: 3651.00, par: 839.99, taxa: 4.59 },
  { renda: 2900, fin: 165421.67, sub: 3002.00, par: 869.99, taxa: 4.85 },
  { renda: 3000, fin: 171425.80, sub: 2401.00, par: 899.99, taxa: 4.85 },
  { renda: 3100, fin: 177430.07, sub: 1878.00, par: 930.00, taxa: 4.85 },
  { renda: 3200, fin: 183434.20, sub: 0.00, par: 960.00, taxa: 5.11 },
  { renda: 3300, fin: 183620.53, sub: 0.00, par: 990.00, taxa: 5.11 },
  { renda: 3400, fin: 189440.27, sub: 0.00, par: 1020.00, taxa: 5.11 },
  { renda: 3500, fin: 195260.01, sub: 0.00, par: 1050.00, taxa: 5.11 },
  { renda: 3600, fin: 189213.16, sub: 0.00, par: 1080.00, taxa: 5.64 },
  { renda: 3700, fin: 194689.45, sub: 0.00, par: 1110.00, taxa: 5.64 },
  { renda: 3800, fin: 200165.74, sub: 0.00, par: 1140.00, taxa: 5.64 },
  { renda: 3900, fin: 205642.04, sub: 0.00, par: 1170.00, taxa: 5.64 },
  { renda: 4000, fin: 208000.00, sub: 0.00, par: 1182.91, taxa: 5.64 },
  { renda: 4100, fin: 192947.76, sub: 0.00, par: 1230.00, taxa: 6.69 },
  { renda: 4200, fin: 197826.17, sub: 0.00, par: 1260.00, taxa: 6.69 },
  { renda: 4300, fin: 202704.59, sub: 0.00, par: 1290.00, taxa: 6.69 },
  { renda: 4400, fin: 207583.00, sub: 0.00, par: 1320.00, taxa: 6.69 },
  { renda: 4500, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4700, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4800, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 4900, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 5000, fin: 208000.00, sub: 0.00, par: 1322.56, taxa: 6.69 },
  { renda: 5100, fin: 212002.26, sub: 0.00, par: 1530.00, taxa: 7.93 },
  { renda: 5200, fin: 216309.50, sub: 0.00, par: 1560.00, taxa: 7.93 },
  { renda: 5300, fin: 220616.73, sub: 0.00, par: 1590.00, taxa: 7.93 },
  { renda: 5400, fin: 224923.97, sub: 0.00, par: 1620.00, taxa: 7.93 },
  { renda: 5500, fin: 229231.21, sub: 0.00, par: 1650.00, taxa: 7.93 },
  { renda: 5600, fin: 233538.45, sub: 0.00, par: 1680.00, taxa: 7.93 },
  { renda: 5700, fin: 237845.69, sub: 0.00, par: 1710.00, taxa: 7.93 },
  { renda: 5800, fin: 242152.92, sub: 0.00, par: 1740.00, taxa: 7.93 },
  { renda: 6000, fin: 250767.40, sub: 0.00, par: 1800.00, taxa: 7.93 },
  { renda: 6500, fin: 272303.59, sub: 0.00, par: 1950.00, taxa: 7.93 },
  { renda: 7000, fin: 293839.78, sub: 0.00, par: 2100.00, taxa: 7.93 },
  { renda: 7500, fin: 315375.97, sub: 0.00, par: 2250.00, taxa: 7.93 },
  { renda: 8000, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 8500, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 9000, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
  { renda: 9600, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 7.93 },
];

// 3. NÃO COTISTA / COM DEPENDENTE (51 registros)
const DATA_NCOT_DEP: RawRow[] = [
  { renda: 1500, fin: 86367.35, sub: 55000.00, par: 449.99, taxa: 4.85 },
  { renda: 1600, fin: 92371.47, sub: 55000.00, par: 479.99, taxa: 4.85 },
  { renda: 1700, fin: 98375.60, sub: 55000.00, par: 509.99, taxa: 4.85 },
  { renda: 1800, fin: 104379.72, sub: 54330.00, par: 539.99, taxa: 4.85 },
  { renda: 1900, fin: 110383.85, sub: 48434.00, par: 569.99, taxa: 4.85 },
  { renda: 2000, fin: 116387.98, sub: 42941.00, par: 599.99, taxa: 4.85 },
  { renda: 2100, fin: 122392.10, sub: 37840.00, par: 629.99, taxa: 4.85 },
  { renda: 2200, fin: 124453.16, sub: 33391.00, par: 659.99, taxa: 5.11 },
  { renda: 2300, fin: 130272.90, sub: 29025.00, par: 689.99, taxa: 5.11 },
  { renda: 2400, fin: 136092.63, sub: 25022.00, par: 719.99, taxa: 5.11 },
  { renda: 2500, fin: 141912.37, sub: 21373.00, par: 749.99, taxa: 5.11 },
  { renda: 2600, fin: 147732.11, sub: 18068.00, par: 779.99, taxa: 5.11 },
  { renda: 2700, fin: 153551.85, sub: 15098.00, par: 809.99, taxa: 5.11 },
  { renda: 2800, fin: 159371.59, sub: 12453.00, par: 839.99, taxa: 5.11 },
  { renda: 2900, fin: 155498.23, sub: 10235.00, par: 869.99, taxa: 5.37 },
  { renda: 3000, fin: 161142.18, sub: 8194.00, par: 899.99, taxa: 5.37 },
  { renda: 3100, fin: 166786.13, sub: 6417.00, par: 930.00, taxa: 5.37 },
  { renda: 3200, fin: 172430.07, sub: 4973.00, par: 960.00, taxa: 5.37 },
  { renda: 3300, fin: 172784.29, sub: 3854.00, par: 990.00, taxa: 5.64 },
  { renda: 3400, fin: 178260.58, sub: 2949.00, par: 1020.00, taxa: 5.64 },
  { renda: 3500, fin: 183736.87, sub: 2307.00, par: 1050.00, taxa: 5.64 },
  { renda: 3600, fin: 178409.57, sub: 1969.00, par: 1080.00, taxa: 6.16 },
  { renda: 3700, fin: 183573.18, sub: 1825.00, par: 1110.00, taxa: 6.16 },
  { renda: 3800, fin: 188736.79, sub: 1804.00, par: 1140.00, taxa: 6.16 },
  { renda: 3900, fin: 193900.40, sub: 1783.00, par: 1170.00, taxa: 6.16 },
  { renda: 4000, fin: 199064.00, sub: 1762.00, par: 1200.00, taxa: 6.16 },
  { renda: 4100, fin: 182641.27, sub: 0.00, par: 1230.00, taxa: 7.22 },
  { renda: 4200, fin: 187259.10, sub: 0.00, par: 1260.00, taxa: 7.22 },
  { renda: 4300, fin: 191876.93, sub: 0.00, par: 1290.00, taxa: 7.22 },
  { renda: 4400, fin: 196494.76, sub: 0.00, par: 1320.00, taxa: 7.22 },
  { renda: 4500, fin: 201112.58, sub: 0.00, par: 1350.00, taxa: 7.22 },
  { renda: 4700, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 4800, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 4900, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 5000, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 5100, fin: 201525.56, sub: 0.00, par: 1530.00, taxa: 8.47 },
  { renda: 5200, fin: 205619.95, sub: 0.00, par: 1560.00, taxa: 8.47 },
  { renda: 5300, fin: 209714.33, sub: 0.00, par: 1590.00, taxa: 8.47 },
  { renda: 5400, fin: 213808.71, sub: 0.00, par: 1620.00, taxa: 8.47 },
  { renda: 5500, fin: 217903.10, sub: 0.00, par: 1650.00, taxa: 8.47 },
  { renda: 5600, fin: 221997.48, sub: 0.00, par: 1680.00, taxa: 8.47 },
  { renda: 5700, fin: 226091.86, sub: 0.00, par: 1710.00, taxa: 8.47 },
  { renda: 5800, fin: 230186.25, sub: 0.00, par: 1740.00, taxa: 8.47 },
  { renda: 6000, fin: 238375.02, sub: 0.00, par: 1800.00, taxa: 8.47 },
  { renda: 6500, fin: 258846.93, sub: 0.00, par: 1950.00, taxa: 8.47 },
  { renda: 7000, fin: 279318.85, sub: 0.00, par: 2100.00, taxa: 8.47 },
  { renda: 7500, fin: 299790.77, sub: 0.00, par: 2250.00, taxa: 8.47 },
  { renda: 8000, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 8500, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 9000, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 9600, fin: 320000.00, sub: 0.00, par: 2282.21, taxa: 8.47 },
];

// 4. NÃO COTISTA / SEM DEPENDENTE (51 registros)
const DATA_NCOT_SDEP: RawRow[] = [
  { renda: 1500, fin: 86367.35, sub: 16500.00, par: 449.99, taxa: 4.85 },
  { renda: 1600, fin: 92371.47, sub: 16500.00, par: 479.99, taxa: 4.85 },
  { renda: 1700, fin: 98375.60, sub: 16500.00, par: 509.99, taxa: 4.85 },
  { renda: 1800, fin: 104379.72, sub: 16299.00, par: 539.99, taxa: 4.85 },
  { renda: 1900, fin: 110383.85, sub: 14530.00, par: 569.99, taxa: 4.85 },
  { renda: 2000, fin: 116387.98, sub: 12882.00, par: 599.99, taxa: 4.85 },
  { renda: 2100, fin: 122392.10, sub: 11352.00, par: 629.99, taxa: 4.85 },
  { renda: 2200, fin: 124453.16, sub: 10017.00, par: 659.99, taxa: 5.11 },
  { renda: 2300, fin: 130272.90, sub: 8707.00, par: 689.99, taxa: 5.11 },
  { renda: 2400, fin: 136092.63, sub: 7506.00, par: 719.99, taxa: 5.11 },
  { renda: 2500, fin: 141912.37, sub: 6411.00, par: 749.99, taxa: 5.11 },
  { renda: 2600, fin: 147732.11, sub: 5420.00, par: 779.99, taxa: 5.11 },
  { renda: 2700, fin: 153551.85, sub: 4529.00, par: 809.99, taxa: 5.11 },
  { renda: 2800, fin: 159371.59, sub: 3735.00, par: 839.99, taxa: 5.11 },
  { renda: 2900, fin: 155498.23, sub: 3070.00, par: 869.99, taxa: 5.37 },
  { renda: 3000, fin: 161142.18, sub: 2458.00, par: 899.99, taxa: 5.37 },
  { renda: 3100, fin: 166786.13, sub: 1925.00, par: 930.00, taxa: 5.37 },
  { renda: 3200, fin: 172430.07, sub: 0.00, par: 960.00, taxa: 5.64 },
  { renda: 3300, fin: 172784.29, sub: 0.00, par: 990.00, taxa: 5.64 },
  { renda: 3400, fin: 178260.58, sub: 0.00, par: 1020.00, taxa: 5.64 },
  { renda: 3500, fin: 183736.87, sub: 0.00, par: 1050.00, taxa: 5.64 },
  { renda: 3600, fin: 178409.57, sub: 0.00, par: 1080.00, taxa: 6.16 },
  { renda: 3700, fin: 183573.18, sub: 0.00, par: 1110.00, taxa: 6.16 },
  { renda: 3800, fin: 188736.79, sub: 0.00, par: 1140.00, taxa: 6.16 },
  { renda: 3900, fin: 193900.40, sub: 0.00, par: 1170.00, taxa: 6.16 },
  { renda: 4000, fin: 199064.00, sub: 0.00, par: 1200.00, taxa: 6.16 },
  { renda: 4100, fin: 182641.27, sub: 0.00, par: 1230.00, taxa: 7.22 },
  { renda: 4200, fin: 187259.10, sub: 0.00, par: 1260.00, taxa: 7.22 },
  { renda: 4300, fin: 191876.93, sub: 0.00, par: 1290.00, taxa: 7.22 },
  { renda: 4400, fin: 196494.76, sub: 0.00, par: 1320.00, taxa: 7.22 },
  { renda: 4500, fin: 201112.58, sub: 0.00, par: 1350.00, taxa: 7.22 },
  { renda: 4700, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 4800, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 4900, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 5000, fin: 208000.00, sub: 0.00, par: 1394.74, taxa: 7.22 },
  { renda: 5100, fin: 201525.56, sub: 0.00, par: 1530.00, taxa: 8.47 },
  { renda: 5200, fin: 205619.95, sub: 0.00, par: 1560.00, taxa: 8.47 },
  { renda: 5300, fin: 209714.33, sub: 0.00, par: 1590.00, taxa: 8.47 },
  { renda: 5400, fin: 213808.71, sub: 0.00, par: 1620.00, taxa: 8.47 },
  { renda: 5500, fin: 217903.10, sub: 0.00, par: 1650.00, taxa: 8.47 },
  { renda: 5600, fin: 221997.48, sub: 0.00, par: 1680.00, taxa: 8.47 },
  { renda: 5700, fin: 226091.86, sub: 0.00, par: 1710.00, taxa: 8.47 },
  { renda: 5800, fin: 230186.25, sub: 0.00, par: 1740.00, taxa: 8.47 },
  { renda: 6000, fin: 238375.02, sub: 0.00, par: 1800.00, taxa: 8.47 },
  { renda: 6500, fin: 258846.93, sub: 0.00, par: 1950.00, taxa: 8.47 },
  { renda: 7000, fin: 279318.85, sub: 0.00, par: 2100.00, taxa: 8.47 },
  { renda: 7500, fin: 299790.77, sub: 0.00, par: 2250.00, taxa: 8.47 },
  { renda: 8000, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 8500, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 9000, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
  { renda: 9600, fin: 320000.00, sub: 0.00, par: 2398.08, taxa: 8.47 },
];

// 5. CLASSE MÉDIA (7 registros: R$ 10.000 a R$ 13.000)
const DATA_CLASSE_MEDIA: RawRow[] = [
  { renda: 10000, fin: 336874.70, sub: 0.00, par: 3000.00, taxa: 10.47 },
  { renda: 10500, fin: 354106.73, sub: 0.00, par: 3150.00, taxa: 10.47 },
  { renda: 11000, fin: 371338.76, sub: 0.00, par: 3300.00, taxa: 10.47 },
  { renda: 11500, fin: 388570.79, sub: 0.00, par: 3450.00, taxa: 10.47 },
  { renda: 12000, fin: 405802.82, sub: 0.00, par: 3600.00, taxa: 10.47 },
  { renda: 12500, fin: 423034.85, sub: 0.00, par: 3750.00, taxa: 10.47 },
  { renda: 13000, fin: 440266.88, sub: 0.00, par: 3900.00, taxa: 10.47 },
];

// Helper functions to generate full McmvBracket objects
function buildBracketsForProfile(
  rows: RawRow[],
  isCotista: boolean,
  temDependente: boolean,
  prefix: string
): McmvBracket[] {
  return rows.map((r) => ({
    id: `${prefix}-${r.renda}`,
    minRenda: r.renda,
    maxRenda: r.renda,
    faixa: getFaixaLabel(r.renda),
    isCotista,
    temDependente,
    financiamentoMax: r.fin,
    subsidioMax: r.sub,
    parcelaEstimada: r.par,
    taxaJurosAnual: r.taxa,
    obs: 'Tabela Oficial MCMV 04/2026 - Associativo CAIXA - Planta Uberlândia/MG (420m)'
  }));
}

// Build 211 full records
export const INITIAL_MCMV_DATA: McmvBracket[] = [
  ...buildBracketsForProfile(DATA_COT_DEP, true, true, 'cot-dep'),
  ...buildBracketsForProfile(DATA_COT_SDEP, true, false, 'cot-sdep'),
  ...buildBracketsForProfile(DATA_NCOT_DEP, false, true, 'ncot-dep'),
  ...buildBracketsForProfile(DATA_NCOT_SDEP, false, false, 'ncot-sdep'),
  // For Classe Média, duplicate across all 4 profile combos so lookup always works
  ...buildBracketsForProfile(DATA_CLASSE_MEDIA, true, true, 'cm-cot-dep'),
  ...buildBracketsForProfile(DATA_CLASSE_MEDIA, true, false, 'cm-cot-sdep'),
  ...buildBracketsForProfile(DATA_CLASSE_MEDIA, false, true, 'cm-ncot-dep'),
  ...buildBracketsForProfile(DATA_CLASSE_MEDIA, false, false, 'cm-ncot-sdep'),
];

/**
 * Helper to interpolate linearly between two values: y0 + t * (y1 - y0)
 */
function lerp(y0: number, y1: number, t: number): number {
  return y0 + t * (y1 - y0);
}

/**
 * Helper to clamp value between min and max bounds
 */
function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Consulta oficial da Tabela MCMV com Interpolação Linear Progressiva
 * 
 * Garante estimativa comercial progressiva para qualquer renda real (ex: R$ 2.092,93),
 * eliminando degraus artificiais e respeitando os limites oficiais da tabela.
 */
export function lookupMcmvTable(
  income: number,
  temDependente: boolean,
  isCotista: boolean,
  tableData: McmvBracket[] = INITIAL_MCMV_DATA
): McmvSimulationResult {
  const cotistaLabel = isCotista ? 'Cotista FGTS (>36m)' : 'Não Cotista';
  const depLabel = temDependente ? 'Com dependente' : 'Sem dependente';
  const perfilLabel = `${cotistaLabel} | ${depLabel}`;

  // Filtrar registros correspondentes ao perfil do cliente
  const filtered = tableData.filter(
    (b) => b.isCotista === isCotista && b.temDependente === temDependente
  );

  if (filtered.length === 0) {
    return {
      income,
      temDependente,
      isCotista,
      perfilLabel,
      financiamento: 0,
      subsidio: 0,
      parcela: 0,
      taxaJuros: 0,
      faixa: 'Não configurada',
      bracketMatched: null,
      isExactMatch: false,
    };
  }

  // Ordenar de forma crescente pela renda
  const sorted = [...filtered].sort((a, b) => a.minRenda - b.minRenda);
  const floorBracket = sorted[0];
  const ceilingBracket = sorted[sorted.length - 1];

  let financiamento: number;
  let subsidio: number;
  let parcela: number;
  let taxaJuros: number;
  let faixa: string;
  let bracketMatched: McmvBracket;
  let isExactMatch = false;
  let enquadramentoNotice: string | undefined = undefined;

  // Caso 1: Renda abaixo ou igual ao piso da tabela
  if (income <= floorBracket.minRenda) {
    financiamento = floorBracket.financiamentoMax;
    subsidio = floorBracket.subsidioMax;
    parcela = floorBracket.parcelaEstimada;
    taxaJuros = floorBracket.taxaJurosAnual;
    faixa = floorBracket.faixa;
    bracketMatched = floorBracket;
    isExactMatch = income === floorBracket.minRenda;
    if (!isExactMatch) {
      enquadramentoNotice = `A renda informada (R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) é inferior ao piso da tabela e foi calculada com base no piso de referência de R$ ${floorBracket.minRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    }
  }
  // Caso 2: Renda acima ou igual ao teto da tabela
  else if (income >= ceilingBracket.minRenda) {
    financiamento = ceilingBracket.financiamentoMax;
    subsidio = ceilingBracket.subsidioMax;
    parcela = ceilingBracket.parcelaEstimada;
    taxaJuros = ceilingBracket.taxaJurosAnual;
    faixa = ceilingBracket.faixa;
    bracketMatched = ceilingBracket;
    isExactMatch = income === ceilingBracket.minRenda;
    if (!isExactMatch) {
      enquadramentoNotice = `A renda informada (R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) ultrapassa o teto e foi calculada com base no teto de referência de R$ ${ceilingBracket.minRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`;
    }
  }
  // Caso 3: Renda intermediária dentro dos limites da tabela (Interpolação Linear Progressiva)
  else {
    // Localizar as duas faixas delimitadoras (inferior e superior)
    let lowerIndex = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].minRenda <= income && income <= sorted[i + 1].minRenda) {
        lowerIndex = i;
        break;
      }
    }

    const lowerBracket = sorted[lowerIndex];
    const upperBracket = sorted[lowerIndex + 1];

    if (income === lowerBracket.minRenda) {
      // Coincidência exata com o limite inferior
      financiamento = lowerBracket.financiamentoMax;
      subsidio = lowerBracket.subsidioMax;
      parcela = lowerBracket.parcelaEstimada;
      taxaJuros = lowerBracket.taxaJurosAnual;
      faixa = lowerBracket.faixa;
      bracketMatched = lowerBracket;
      isExactMatch = true;
    } else if (income === upperBracket.minRenda) {
      // Coincidência exata com o limite superior
      financiamento = upperBracket.financiamentoMax;
      subsidio = upperBracket.subsidioMax;
      parcela = upperBracket.parcelaEstimada;
      taxaJuros = upperBracket.taxaJurosAnual;
      faixa = upperBracket.faixa;
      bracketMatched = upperBracket;
      isExactMatch = true;
    } else {
      // Posição proporcional t ∈ (0, 1) dentro do intervalo
      const deltaRenda = upperBracket.minRenda - lowerBracket.minRenda;
      const t = deltaRenda > 0 ? (income - lowerBracket.minRenda) / deltaRenda : 0;
      const clampedT = clamp(t, 0, 1);

      // 1. Financiamento aproximado progressivo
      const rawFin = lerp(lowerBracket.financiamentoMax, upperBracket.financiamentoMax, clampedT);
      const minFin = Math.min(lowerBracket.financiamentoMax, upperBracket.financiamentoMax);
      const maxFin = Math.max(lowerBracket.financiamentoMax, upperBracket.financiamentoMax);
      financiamento = clamp(rawFin, minFin, maxFin);

      // 2. Subsídio aproximado progressivo
      const rawSub = lerp(lowerBracket.subsidioMax, upperBracket.subsidioMax, clampedT);
      const minSub = Math.min(lowerBracket.subsidioMax, upperBracket.subsidioMax);
      const maxSub = Math.max(lowerBracket.subsidioMax, upperBracket.subsidioMax);
      subsidio = Math.max(0, clamp(rawSub, minSub, maxSub));

      // 3. Parcela estimada aproximada progressiva
      const rawPar = lerp(lowerBracket.parcelaEstimada, upperBracket.parcelaEstimada, clampedT);
      const minPar = Math.min(lowerBracket.parcelaEstimada, upperBracket.parcelaEstimada);
      const maxPar = Math.max(lowerBracket.parcelaEstimada, upperBracket.parcelaEstimada);
      parcela = clamp(rawPar, minPar, maxPar);

      // 4. Taxa de juros anual aproximada progressiva
      const rawTaxa = lerp(lowerBracket.taxaJurosAnual, upperBracket.taxaJurosAnual, clampedT);
      const minTaxa = Math.min(lowerBracket.taxaJurosAnual, upperBracket.taxaJurosAnual);
      const maxTaxa = Math.max(lowerBracket.taxaJurosAnual, upperBracket.taxaJurosAnual);
      taxaJuros = clamp(rawTaxa, minTaxa, maxTaxa);

      // 5. Faixa enquadrada conforme a renda real informada
      faixa = getFaixaLabel(income);
      isExactMatch = false;

      // Criação de registro sintético representando os dados interpolados
      bracketMatched = {
        id: `interpolated-${income}`,
        minRenda: income,
        maxRenda: income,
        faixa: getFaixaLabel(income),
        isCotista,
        temDependente,
        financiamentoMax: Number(financiamento.toFixed(2)),
        subsidioMax: Number(subsidio.toFixed(2)),
        parcelaEstimada: Number(parcela.toFixed(2)),
        taxaJurosAnual: Number(taxaJuros.toFixed(2)),
        obs: `Estimativa progressiva calculada para a renda real de R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (interpolação entre R$ ${lowerBracket.minRenda} e R$ ${upperBracket.minRenda})`,
      };
    }
  }

  return {
    income,
    temDependente,
    isCotista,
    perfilLabel,
    financiamento: Number(financiamento.toFixed(2)),
    subsidio: Number(subsidio.toFixed(2)),
    parcela: Number(parcela.toFixed(2)),
    taxaJuros: Number(taxaJuros.toFixed(2)),
    faixa,
    bracketMatched,
    isExactMatch,
    enquadramentoNotice,
  };
}
