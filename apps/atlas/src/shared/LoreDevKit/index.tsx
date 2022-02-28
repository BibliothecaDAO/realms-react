import TokenLabel from "../ElementsLabel";
import { LDKSchema } from "./lib";

const LoreDevKit = ({ ldk }: { ldk: LDKSchema }) => {
  return (
    <div className="block">
      <div className="flex flex-row items-center justify-between mb-4">
        <h1>
          Desiege S1: <TokenLabel>Divine Eclipse</TokenLabel>
        </h1>
        <span className="px-2 py-1 text-sm bg-black rounded-sm">
          LDK Schema v0.1-alpha
        </span>
      </div>
      {ldk.layers.map((l, i) => (
        <div className="px-8 py-4 border-t-2 border-gray-400" key={i}>
          <h3 className="list-disc">{l.title}</h3>
          <ul>
            {l.descriptions.map((d, i) => (
              <li className="list-disc list-inside" key={i}>
                {d}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* <h2>Lore Development Kit Principles</h2>
      <ul>
        <li>
          Lore creation flows in the direction from source contracts to
          community canon.
        </li>
        <li>Lore development Layers adhere to the LDK schema.</li>
      </ul> */}
    </div>
  );
};

export default LoreDevKit;
