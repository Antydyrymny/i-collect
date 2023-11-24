const versioningRegex = /#(\d+)$/;

export const getNameVersion = (nameToVersion: string, names: string[]): string =>
    names.length === 1
        ? nameToVersion
        : names.reduce((acc, name) => {
              if (name === acc) {
                  const versioned = acc.match(versioningRegex);
                  if (!versioned) return acc + '#2';
                  else return acc.replace(versioningRegex, `#${+versioned[1] + 1}`);
              }
              const versioned = name.match(versioningRegex);
              if (!versioned || name.slice(0, -versioned[0].length) !== acc) {
                  return acc;
              } else {
                  return !acc.match(versioningRegex) ||
                      +versioned[1] > +acc.match(versioningRegex)?.[1]
                      ? name.replace(versioningRegex, `#${+versioned[1] + 1}`)
                      : acc;
              }
          }, nameToVersion);
