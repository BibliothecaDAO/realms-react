export function makeTextSprite(
  locationId,
  defenders,
  attackers,
  defendingOrderId,
  parameters
) {
  if (parameters === undefined) parameters = {};
  const fontface = parameters.hasOwnProperty('fontface')
    ? parameters['fontface']
    : 'Courier New';
  const fontsize = parameters.hasOwnProperty('fontsize')
    ? parameters['fontsize']
    : 18;
  const borderThickness = parameters.hasOwnProperty('borderThickness')
    ? parameters['borderThickness']
    : 4;
  const borderColor = parameters.hasOwnProperty('borderColor')
    ? parameters['borderColor']
    : { r: 0, g: 0, b: 0, a: 1.0 };
  const backgroundColor = parameters.hasOwnProperty('backgroundColor')
    ? parameters['backgroundColor']
    : { r: 0, g: 0, b: 255, a: 1.0 };
  const textColor = parameters.hasOwnProperty('textColor')
    ? parameters['textColor']
    : { r: 0, g: 0, b: 0, a: 1.0 };

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = 'Bold ' + fontsize + 'px ' + fontface;

  context.fillStyle = 'rgba(255, 229, 152)';

  context.strokeStyle = 'rgba(255, 229, 152)';
  context.beginPath();
  context.roundRect(0, 0, 300, 150, 20);
  context.stroke();
  context.fill();

  context.strokeStyle =
    'rgba(' +
    borderColor.r +
    ',' +
    borderColor.g +
    ',' +
    borderColor.b +
    ',' +
    borderColor.a +
    ')';
  context.fillStyle =
    'rgba(' + textColor.r + ', ' + textColor.g + ', ' + textColor.b + ', 1.0)';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  const x = canvas.width / 2;
  // context.fillText(message, x, fontsize)
  context.translate(10, 0);
  let p = new Path2D(
    'M48 80V192c0 2.5 1.2 4.9 3.2 6.4l51.2 38.4c6.8 5.1 10.4 13.4 9.5 21.9L101.5 352H53.2l9.4-85L22.4 236.8C8.3 226.2 0 209.6 0 192V72C0 49.9 17.9 32 40 32H344c22.1 0 40 17.9 40 40V192c0 17.6-8.3 34.2-22.4 44.8L321.4 267l9.4 85H282.5l-10.4-93.3c-.9-8.4 2.7-16.8 9.5-21.9l51.2-38.4c2-1.5 3.2-3.9 3.2-6.4V80H272v24c0 13.3-10.7 24-24 24s-24-10.7-24-24V80H160v24c0 13.3-10.7 24-24 24s-24-10.7-24-24V80H48zm4.7 384H331.3l-16.6-32H69.2L52.7 464zm271.9-80c12 0 22.9 6.7 28.4 17.3l26.5 51.2c3 5.8 4.6 12.2 4.6 18.7c0 22.5-18.2 40.8-40.8 40.8H40.8C18.2 512 0 493.8 0 471.2c0-6.5 1.6-12.9 4.6-18.7l26.5-51.2C36.5 390.7 47.5 384 59.5 384h265zM176 288c-8.8 0-16-7.2-16-16V224c0-17.7 14.3-32 32-32s32 14.3 32 32v48c0 8.8-7.2 16-16 16H176z'
  );
  context.save();

  context.scale(0.1, 0.1);
  context.fill(p);
  context.restore();
  context.fillText('North Tower', x, fontsize);

  context.translate(0, 50);
  context.fillText(`${defenders} defending`, x, fontsize);

  context.translate(0, 30);
  context.fillText(`${attackers} attacking`, x, fontsize);

  // second icon
  context.translate(0, -10);
  p = new Path2D(
    'M389.149,210.959l-0.594,0.01c-13.325,0.478-29.849,0.962-46.515,1.444c-15.568,0.457-31.26,0.922-44.595,1.384 c7.673-33.763,22.552-67.311,36.968-99.828c13.051-29.419,26.538-59.844,34.51-90.096l0.163-0.594 c0.076-0.264,0.147-0.531,0.218-0.78c2.92-3.806,3.555-8.584,1.646-13.073C368.588,3.88,362.774,0,356.802,0 c-3.493,0-6.814,1.274-9.592,3.691c-28.549,24.783-49.028,45.329-66.278,66.466c-49.68,56.594-107.071,114.303-175.438,176.409 c-0.317,0.284-0.571,0.568-0.516,0.568c-4.44,3.961-5.989,10.812-3.763,16.661c2.125,5.591,7.061,8.932,13.195,8.932 c26.956,0,55.535,0.057,84.401,0.671c-37.638,75.789-74.598,133.967-115.973,182.604c-3.101,3.646-4.233,8.136-3.225,12.686 c0.833,7.616,6.718,13.522,13.561,13.522c2.772,0,5.555-0.98,8.046-2.834c98.614-73.428,202.654-152.532,295.368-241.166 c0.665-0.632,1.265-1.315,1.813-2.069c4.225-4.044,5.717-10.668,3.595-16.374C399.956,214.25,395.152,210.959,389.149,210.959z M234.561,266.319c2.265-4.723,1.991-9.922-0.749-14.279c-2.829-4.488-7.919-7.394-12.974-7.394c-0.681,0-1.358,0.051-2.019,0.152 c-23.603-0.738-46.715-0.982-67.332-1.081c54.441-50.62,101.511-98.417,143.628-145.814c1.061-0.784,1.97-1.663,2.762-2.671 c0.894-1.15,1.823-2.275,2.742-3.387l2.885-3.375c0.513-0.566,0.919-1.155,1.305-1.747c5.027-6.018,10.364-12.022,16.092-18.091 c-4.402,10.936-9.013,21.896-13.543,32.639c-16.482,39.162-33.534,79.651-41.304,120.813c-0.102,0.559-0.162,1.104-0.208,1.63 c-1.706,4.517-1.26,9.786,1.233,13.721c2.473,3.89,6.662,6.122,11.507,6.122l0.614-0.018c12.091-0.447,27.817-0.889,43.473-1.331 c9.588-0.274,19.149-0.541,27.838-0.81c-63.968,58.739-131.573,112.408-188.172,155.678 C186.98,359.104,210.76,316.033,234.561,266.319z'
  );
  context.save();

  context.scale(0.1, 0.1);
  context.fill(p);
  context.restore();

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return (
    <sprite position={[0, 0.5, 0]}>
      <spriteMaterial map={texture} />
    </sprite>
  );

