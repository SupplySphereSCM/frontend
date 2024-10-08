import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
// @mui
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
// types
import { ISupplyChainItem } from "src/types/supplychain";
// components
import Iconify from "src/components/iconify";
import { useRouter } from "src/routes/hooks";
import SearchNotFound from "src/components/search-not-found";

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: ISupplyChainItem[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function SupplyChainSearch({
  query,
  results,
  onSearch,
  hrefItem,
}: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(hrefItem(id));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query) {
      if (event.key === "Enter") {
        const selectProduct = results.filter(
          (supplyChain) => supplyChain.name === query,
        )[0];

        handleClick(selectProduct.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: "unset" }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ ml: 1, color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, supplyChain, { inputValue }) => {
        const matches = match(supplyChain.name, inputValue);
        const parts = parse(supplyChain.name, matches);

        return (
          <Box
            component="li"
            {...props}
            onClick={() => handleClick(supplyChain.id)}
            key={supplyChain.id}
          >
            <div>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? "primary" : "textPrimary"}
                  sx={{
                    typography: "body2",
                    fontWeight: part.highlight
                      ? "fontWeightSemiBold"
                      : "fontWeightMedium",
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}
