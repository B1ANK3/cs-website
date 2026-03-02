{ 
    description = "Development shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/release-25.11";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    nixpkgs,
    utils,
    ...
  }:
    utils.lib.eachDefaultSystem (system: let
      overlays = [];
      pkgs = import nixpkgs {
        inherit system overlays;
        config = {
            allowUnfree = true;
        };
      };
    in
      with pkgs; {
        devShells.default = mkShell {
          nativeBuildInputs = [
            pkg-config
          ];

          buildInputs = [
            nodejs_24
            pnpm
            vscode
          ];

          # Try pick zsh else default to $SHELL (bash)
          shellHook = ''
            temp_=$(which zsh); export SHELL=''${temp_:-$SHELL};
          '';
        };
      });
}
