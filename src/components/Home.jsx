import React from "react";
import {
  Box,
  Select,
  Heading,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
const Home = () => {
  const [input, setInput] = useState([]);
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const toast = useToast();
  const [price, setPrice] = useState(0);
  //console.log(facility, date, startTime, endTime, price);
  //console.log(input, input.length);

  const resetValues = () => {
    setFacility("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setPrice(0);
  };

  const checkOverlap = (startHour, endHour) => {
    for (const booking of input) {
        if (
            booking.booked &&
            booking.start < endHour &&
            booking.end > startHour &&
            booking.bookedDate === date &&
            booking.facility === facility
          ) {
            return true; // There is an overlap
          }
    }
    return false; // No overlap found
  };
  const handleClick = () => {
    let [startHour, startMin] = startTime.split(":");
    let [endHour, endMin] = endTime.split(":");
    let totalPrice = 0;
    //console.log(+startHour, +startMin, +endHour, +endMin);

    if (facility === "" || date === "" || startTime === "" || endTime === "") {
      return toast({
        title: "Please Fill All Details.",
        description: "Some Details Missing",
        position: "top",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
    if (
      +endHour < +startHour ||
      (+endHour === +startHour && +endMin <= +startMin)
    ) {
      return toast({
        title: "Please check your end Time",
        description: "End time should not be less than or equal to start Time",
        position: "top",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
    if (
      +startHour < 10 ||
      +endHour < 10 ||
      +startHour > 22 ||
      +endHour > 22 ||
      (+endHour === 22 && +endMin > 0) ||
      (+startHour === 22 && +startMin > 0)
    ) {
      return toast({
        title: "You cannot book before 10Am Or After 10Pm",
        description: "Please Book Your Slot between 10Am and 10Pm",
        position: "top",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }

    if (+endMin < +startMin) {
      endMin = +endMin + 60;
      endHour = +endHour - 1;
    }
    if (facility === "Club House") {
      if (+startHour >= 10 && +endHour < 16) {
        let totalTime =
          Number(endHour) -
          Number(startHour) +
          Math.ceil(+(endMin - +startMin) / 60);
        totalPrice += totalTime * 100;
        //console.log(totalPrice);
        setPrice(totalPrice);
      } else if (+startHour >= 16 && +endHour <= 22) {
        let totalTime =
          Number(endHour) -
          Number(startHour) +
          Math.ceil(+(endMin - +startMin) / 60);
        totalPrice += totalTime * 500;
        //console.log(totalPrice);
        setPrice(totalPrice);
      } else {
        let totalTime =
          (16 - Number(startHour)) * 100 +
          (Number(endHour) - 16 + +Math.ceil(+(endMin - +startMin) / 60)) * 500;
        totalPrice += totalTime;
        //console.log(totalPrice);
        setPrice(totalPrice);
      }
    } else if (facility === "Tennis Court") {
      if (+startHour >= 10 && +endHour <= 22) {
        let totalTime =
          Number(endHour) -
          Number(startHour) +
          Math.ceil(+(endMin - +startMin) / 60);
        totalPrice += totalTime * 50;
        //console.log(totalPrice);
        setPrice(totalPrice);
      }
    }
    if (input.length === 0 || !checkOverlap(+startHour, +endHour, date)) {
    //   console.log(startHour);
      let data = {
        start: +startHour,
        end: +endHour,
        booked: true,
        bookedPrice: totalPrice,
        bookedDate: date,
        facility,
      };
    //   console.log(data);
      setInput([...input, data]);
      //   resetValues();
      return toast({
        title: "Booked",
        description: `Rs. ${totalPrice}`,
        position: "top",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // console.log(input);
    } else {
      return toast({
        title: "Booking Failed",
        description: "Already Booked",
        position: "top",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
//   console.log(input);
  return (
    <Box
      w={"25%"}
      m={"30px auto"}
      p={"20px"}
      boxShadow={"rgba(0, 0, 0, 0.35)0px 5px 15px"}
      borderRadius={"12px"}
    >
      <Heading m={"20px auto"} as={"h1"} size={"md"}>
        Facility Booking Form
      </Heading>
      <Select
        m={"10px auto"}
        value={facility}
        onChange={(e) => setFacility(e.target.value)}
      >
        <option value="">Select Facility</option>
        <option value="Club House">Club House</option>
        <option value="Tennis Court">Tennis Court</option>
      </Select>
      <Input
        m={"10px auto"}
        type="date"
        min="2023-08-02"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Input
        m={"10px auto"}
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <Input
        m={"10px auto"}
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <Button colorScheme={"teal"} m={"10px auto"} onClick={handleClick}>
        Book Now
      </Button>
    </Box>
  );
};
export default Home;
