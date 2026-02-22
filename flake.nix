{
  description = "Bugs";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
    git-hooks.url = "github:cachix/git-hooks.nix";
    git-hooks.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = {
    self,
    nixpkgs,
    git-hooks,
  }: let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages.${system};
  in {
    checks.${system} = {
      pre-commit-check = git-hooks.lib.${system}.run {
        src = ./.;
        hooks = {
          format = {
            enable = true;
            name = "format";
            entry = "npm run format";
            pass_filenames = false;
          };
          lint = {
            enable = true;
            name = "lint";
            entry = "npm run lint";
            pass_filenames = false;
          };
          check = {
            enable = true;
            name = "check";
            entry = "npm run check";
            pass_filenames = false;
          };
        };
      };
    };

    devShells.${system}.default = let
      inherit (self.checks.${system}.pre-commit-check) shellHook enabledPackages;
    in
      pkgs.mkShell {
        inherit shellHook;
        packages = enabledPackages ++ [
          pkgs.nodejs_24
        ];
      };
  };
}
