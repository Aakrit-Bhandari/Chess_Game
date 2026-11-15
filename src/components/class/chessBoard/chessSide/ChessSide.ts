import type { IChessSide } from "../../types";

export class ChessSide implements IChessSide {
  public isKingUnderAttack: boolean = false;

  public resetThreath() {
    this.isKingUnderAttack = false;
  }
}
