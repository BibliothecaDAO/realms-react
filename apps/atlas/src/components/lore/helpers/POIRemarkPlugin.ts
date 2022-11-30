export const poiRemarkPlugin = () => {
  const rule = /\$\{([^}]+)\}/g;

  const iterate = (children) => {
    const newChildren: any[] = [];

    for (const k in children) {
      const elem = children[k] as any;
      // console.log(elem);

      // Recursive
      if (elem.children) {
        elem.children = iterate(elem.children);
        newChildren.push(elem);
        continue;
      }

      // console.log(newChildren);

      // Pass non-text
      if (elem.type !== 'text') {
        continue;
      }

      const allFound = elem.value.match(rule);

      // console.log(allFound);

      if (allFound) {
        let tempTail = elem.value;

        // Split string into POIs and text
        for (const j in allFound) {
          const found = allFound[j];
          // console.log(found);
          const [head, ...tail] = tempTail.split(found);
          // edge case: two same `found` strings in the same elem can break the splitting
          // fix: the `join` operation introduces the second `found` again
          tempTail = tail.join(found);

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
