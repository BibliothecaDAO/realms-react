export const poiRemarkPlugin = () => {
  const rule = /\$\{([^}]+)\}/g;

  const iterate = (children) => {
    const newChildren = [];

    for (const k in children) {
      const elem = children[k] as any;

      // Recursive
      if (elem.children) {
        elem.children = iterate(elem.children);
        newChildren.push(elem);
        continue;
      }

      // Pass non-text
      if (elem.type !== 'text') {
        continue;
      }

      const allFound = elem.value.match(rule);

      if (allFound) {
        let tempTail = elem.value;

        // Split string into POIs and text
        for (const j in allFound) {
          const found = allFound[j];

          const [head, tail] = tempTail.split(found);
          tempTail = tail;

          const poiSpl = found
            .replace('$', '')
            .replace('{', '')
            .replace('}', '')
            .split(',');

          newChildren.push({ type: 'text', value: head });
          newChildren.push({
            type: 'poi',
            data: {
              hProperties: {
                poiId: poiSpl[0].trim(),
                assetId: poiSpl.length === 2 ? poiSpl[1].trim() : null,
              },
            },
          });
        }
        // Tail goes the last because everything else is already split
        newChildren.push({ type: 'text', value: tempTail });
        continue;
      }

      newChildren.push(elem);
    }

    return newChildren;
  };

  return (node) => {
    node.children = iterate(node.children);
    return node;
  };
};
