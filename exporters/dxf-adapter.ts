// DXF Adapter Skeleton per ADR-0006
// No external imports; placeholder types only

type Point = { x: number; y: number };

type Layer = 'DUCT_MAIN' | 'FITTINGS' | 'LABELS' | 'NODES' | 'GUIDES';

type DXFOptions = {
  version?: 'R2018';
  units?: 'inches';
};

export class DXFAdapter {
  private entities: string[] = [];
  private header: string[] = [];
  constructor(private opts: DXFOptions = { version: 'R2018', units: 'inches' }) {
    this.header.push(`999\nSizeWise DXF Export`);
    // Layer/table/style defs would go here
  }

  addPolyline(points: Point[], layer: Layer = 'DUCT_MAIN') {
    // Placeholder polyline entity
    this.entities.push(`0\nLWPOLYLINE\n8\n${layer}`);
  }

  addText(text: string, at: Point, height = 0.125, layer: Layer = 'LABELS') {
    this.entities.push(`0\nTEXT\n8\n${layer}\n10\n${at.x}\n20\n${at.y}\n40\n${height}\n1\n${text}`);
  }

  // Sample block name mapping
  blockName(kind: 'ELBOW_90_LR' | 'ELBOW_45' | 'TEE' | 'TRANSITION') {
    return kind;
  }

  toString(): string {
    // Extremely simplified DXF skeleton
    return [
      '0\nSECTION\n2\nHEADER',
      ...this.header,
      '0\nENDSEC',
      '0\nSECTION\n2\nENTITIES',
      ...this.entities,
      '0\nENDSEC',
      '0\nEOF',
    ].join('\n');
  }
}

