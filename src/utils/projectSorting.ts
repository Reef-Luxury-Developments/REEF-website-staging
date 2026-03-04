/**
 * Helper function to extract number from project name (e.g., "REEF 5" -> 5)
 * @param name - The project name string
 * @returns The extracted number or null if no number is found
 */
export const extractProjectNumber = (name: string): number | null => {
  if (!name) return null;
  // Match "REEF" followed by optional whitespace and a number
  const match = name.match(/REEF\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
};

/**
 * Generic sorting function for projects based on the number in their name
 * Projects with numbers are sorted ascending, projects without numbers maintain original order
 * @param items - Array of items to sort
 * @param getName - Function to extract the name from each item
 * @returns Sorted array
 */
export function sortProjectsByName<T>(
  items: T[],
  getName: (item: T) => string
): T[] {
  // Map items with original index to maintain order for items without numbers
  const mappedItems = items.map((item, index) => ({
    item,
    originalIndex: index,
    projectNumber: extractProjectNumber(getName(item)),
  }));

  // Sort items: items with numbers first (ascending), then items without numbers (original order)
  const sorted = mappedItems.sort((a, b) => {
    const numA = a.projectNumber;
    const numB = b.projectNumber;

    // If both have numbers, sort by number
    if (numA !== null && numB !== null) {
      return numA - numB;
    }

    // If only A has a number, A comes first
    if (numA !== null && numB === null) {
      return -1;
    }

    // If only B has a number, B comes first
    if (numA === null && numB !== null) {
      return 1;
    }

    // If neither has a number, maintain original order
    return a.originalIndex - b.originalIndex;
  });

  // Return only the items
  return sorted.map(({ item }) => item);
}
