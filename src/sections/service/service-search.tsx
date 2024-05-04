import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
// @mui
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete, { autocompleteClasses } from "@mui/material/Autocomplete";
// routes
import { useRouter } from "src/routes/hooks";
// components
import Iconify from "src/components/iconify";
import SearchNotFound from "src/components/search-not-found";
// types
import { IServiceItem } from "src/types/service";

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: IServiceItem[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
  loading?: boolean;
};

export default function ServiceSearch({
  query,
  results,
  onSearch,
  hrefItem,
  loading,
}: Props) {
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(hrefItem(id));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query) {
      if (event.key === "Enter") {
        const selectItem = results.filter(
          (service) => service.name === query,
        )[0];

        handleClick(selectItem.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: "unset" }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: "bottom-start",
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
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
            endAdornment: (
              <>
                {loading ? (
                  <Iconify icon="svg-spinners:8-dots-rotate" sx={{ mr: -3 }} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, service, { inputValue }) => {
        const matches = match(service.name, inputValue);
        const parts = parse(service.name, matches);

        return (
          <Box
            component="li"
            {...props}
            onClick={() => handleClick(service.id)}
            key={service.id}
          >
            <Avatar
              key={service.id}
              alt={service.name}
              src={service.coverUrl}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div key={inputValue}>
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
