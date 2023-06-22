import React, { useState } from "react";
import {
  Box,
  CssBaseline,
  TextField,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  FormHelperText,
  Button,
} from "@mui/material";
import styled from "@emotion/styled";
import { type Dayjs } from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AddIcon from "@mui/icons-material/Add";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const Block = styled(Box)(() => ({
  width: 750,
  background: "aliceblue",
  borderRadius: 16,
  padding: 24,
  marginBottom: 24,
}));

const TextFieldStyled = styled(TextField)(() => ({
  display: "block",
  ".MuiOutlinedInput-notchedOutline": {
    display: "none",
  },
  ".MuiOutlinedInput-input": {
    fontSize: 24,
    fontWeight: 700,
    color: "cornflowerblue",
    padding: 0,
  },
  "&:before": {
    fontSize: 22,
    fontWeight: 700,
    color: "cornflowerblue",
    content: '"$"',
  },
}));

const CHARACTER_LIMIT = 31;
const BLOCKS_LIMIT_MAX = 5;

const createProperties = () => ({
  amount: "0.00",
  fromAccount: "",
  payee: "",
  date: null,
  repeat: "",
  note: "",
});

interface EditableProps {
  amount: string;
  fromAccount: string;
  payee: string;
  date: Dayjs | null;
  repeat: string;
  note: string;
}

interface AmountBlockProps extends EditableProps {
  hasCloseIcon: boolean;
  onChange: (property: Partial<EditableProps>) => void;
  onClose: () => void;
}

const AmountBlock = (props: AmountBlockProps) => {
  const {
    hasCloseIcon = true,
    amount,
    fromAccount,
    payee,
    date,
    repeat,
    note,
    onChange,
    onClose,
  } = props;

  const mockPayeeHelperText = () => {
    if (payee === "London Hydro") return "Last payment was 2 days ago";
    if (payee === "Berlin Vydro") return "Last payment was 3 days ago";
    if (payee === "Miami Bobr") return "Last payment was 4 days ago";
    return "";
  };

  const handleChange = (
    propertyName: keyof EditableProps,
    propertyValue: EditableProps[keyof EditableProps]
  ) => {
    onChange({ [propertyName]: propertyValue });
  };
  return (
    <Block>
      <Box display="flex" justifyContent="space-between">
        <Box>
          <Typography color="gray" fontSize={12}>
            Amount
          </Typography>
          <TextFieldStyled
            value={amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              handleChange("amount", event.target.value);
            }}
          />
        </Box>
        {hasCloseIcon && (
          <HighlightOffIcon cursor="pointer" onClick={onClose} />
        )}
      </Box>
      <Box>
        <Box display="flex" gap={2} my={3}>
          <FormControl fullWidth>
            <InputLabel id="from-account">From Account</InputLabel>
            <Select
              labelId="from-account"
              value={fromAccount}
              label="From Account"
              onChange={(event: SelectChangeEvent) => {
                handleChange("fromAccount", event.target.value);
              }}
            >
              <MenuItem value={"12000"}>My Checking Account: $12000</MenuItem>
              <MenuItem value={"1200"}>My Other Account: $1200</MenuItem>
              <MenuItem value={"20"}>My Another Account: $20</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="payee">Payee</InputLabel>
            <Select
              labelId="payee"
              value={payee}
              label="Payee"
              onChange={(event: SelectChangeEvent) => {
                handleChange("payee", event.target.value);
              }}
            >
              <MenuItem value="London Hydro">London Hydro</MenuItem>
              <MenuItem value="Berlin Vydro">Berlin Vydro</MenuItem>
              <MenuItem value="Miami Bobr">Miami Bobr</MenuItem>
            </Select>
            <FormHelperText>{mockPayeeHelperText()}</FormHelperText>
          </FormControl>
        </Box>
        <Box display="flex" gap={2}>
          <Box flex={1}>
            <MobileDatePicker
              label="Date"
              value={date}
              format="MMM DD, YYYY"
              onChange={(newDate) => handleChange("date", newDate)}
            />
          </Box>
          <Box flex={2}>
            <FormControl fullWidth>
              <InputLabel id="repeat">Repeat</InputLabel>
              <Select
                labelId="repeat"
                value={repeat}
                label="Repeat"
                onChange={(event: SelectChangeEvent) => {
                  handleChange("repeat", event.target.value);
                }}
              >
                <MenuItem value={"2"}>Every 2 month till Oct 12.23</MenuItem>
                <MenuItem value={"3"}>Every 3 month till Oct 12.23</MenuItem>
                <MenuItem value={"4"}>Every 4 month till Oct 12.23</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box flex={2}>
            <TextField
              focused
              label="Note"
              fullWidth
              inputProps={{ maxLength: CHARACTER_LIMIT }}
              value={note}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange("note", event.target.value);
              }}
              helperText={`${note.length}/${CHARACTER_LIMIT}`}
              FormHelperTextProps={{ sx: { textAlign: "right" } }}
            />
          </Box>
        </Box>
      </Box>
    </Block>
  );
};

const checkAddBlockBtn = (blocks: EditableProps[]) => {
  return blocks.every(
    (item) =>
      item.amount.length > 0 &&
      item.date !== null &&
      item.note.length > 0 &&
      item.payee.length > 0 &&
      item.fromAccount.length > 0 &&
      item.repeat.length > 0
  );
};

function App() {
  const [blocks, setBlocks] = useState<Array<EditableProps>>([
    createProperties(),
  ]);

  const handleAddBlocks = () => {
    setBlocks((prevState) => {
      return [...prevState, createProperties()];
    });
  };

  const handleChange = (index: number, property: Partial<EditableProps>) => {
    setBlocks((prevState) => {
      const begin = prevState.slice(0, index);
      const end = prevState.slice(index + 1);
      const current = prevState[index];
      return [...begin, { ...current, ...property }, ...end];
    });
  };

  const handleClose = (index: number) => {
    setBlocks((prevState) => {
      const begin = prevState.slice(0, index);
      const end = prevState.slice(index + 1);
      return [...begin, ...end];
    });
  };

  const canAddBlock =
    checkAddBlockBtn(blocks) && blocks.length < BLOCKS_LIMIT_MAX;
  const getAmountNumber = (val: string) => (/^\d*\.?\d*$/.test(val) ? val : "");

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <CssBaseline />
      <Box
        height="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        {blocks.map((item, index) => {
          return (
            <AmountBlock
              key={`index-${index}`}
              hasCloseIcon={index !== 0}
              onChange={(property) => handleChange(index, property)}
              amount={getAmountNumber(item.amount)}
              fromAccount={item.fromAccount}
              payee={item.payee}
              date={item.date}
              repeat={item.repeat}
              note={item.note}
              onClose={() => handleClose(index)}
            />
          );
        })}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddBlocks}
          disabled={!canAddBlock}
        >
          Add Another Bill
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
