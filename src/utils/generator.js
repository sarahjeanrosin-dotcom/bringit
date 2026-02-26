import { ALL_ITEMS, CATEGORIES } from '../data/packingItems';
import { v4 as uuidv4 } from 'uuid';

export function generatePackingList(tripData) {
  const { days, travelers } = tripData;

  const items = ALL_ITEMS
    .filter(item => item.cond(tripData))
    .map(item => ({
      id: uuidv4(),
      sourceId: item.id,
      name: item.name,
      category: item.category,
      quantity: item.qty(days, travelers),
      checked: false,
      custom: false,
    }));

  // Group by category, respecting CATEGORIES order
  const grouped = {};
  Object.keys(CATEGORIES).forEach(cat => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length > 0) {
      grouped[cat] = catItems;
    }
  });

  return grouped;
}

export function flattenList(grouped) {
  return Object.values(grouped).flat();
}

export function countStats(grouped) {
  const all = flattenList(grouped);
  const total = all.length;
  const checked = all.filter(i => i.checked).length;
  return { total, checked };
}
