export interface Gown {
    gown: string;
    id: string;
    name: string;
    cost: number;
    reusable: boolean;
    laundry_cost: number;
    visible: boolean;
    washes?: number;
    hygine: number;
    comfort: number;
    residual_value: number;
    waste_cost: number;
    certificates: string[];
    fte_local: number;
    fte_local_extra: number;
    emission_impacts: {
      CO2: number;
      Energy: number;
      Water: number;
      purchase_cost: number;
      production: number;
      transportation: number;
      washing: number;
      disposal: number;
      production_costs: number;
      use_cost: number;
      lost_cost: number;
      eol_cost: number;
      laundry_cost: number;
      waste: number;
    };
  }