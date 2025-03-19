import React, { forwardRef, useEffect, useRef } from "react";
import { Flex, Textarea, HStack, IconButton } from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";
import { EVALS, themeColor } from "@/appConfig";
import autosize from "autosize";
function useMergedRefs(...refs) {
  return React.useMemo(() => {
    if (refs.every((ref) => ref == null)) {
      return null;
    }
    return (node) => {
      refs.forEach((ref) => {
        if (ref) {
          if (typeof ref === "function") {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      });
    };
  }, [refs]);
}
const Footer = forwardRef(({ newMessage, onMounted, isProcessing }, ref) => {
  const internalRef = useRef(null);
  const mergedRef = useMergedRefs(internalRef, ref);
  useEffect(() => {
    if (onMounted) {
      onMounted();
    }
  }, [onMounted]);
  useEffect(() => {
    if (internalRef.current) {
      autosize(internalRef.current);
    }
  }, []);
  return (
    <HStack
      style={{
        border: "none",
        borderLeft: "1px solid",
        borderTop: "1px solid",
        borderBottom: "1px solid",
        borderColor: `${themeColor}`,
        borderRadius: "8px",
      }}
    >
      <Flex className="messageInputs">
        <Textarea
          isDisabled={isProcessing}
          data="input-field"
          id="footer-statement"
          w={"100%"}
          data-status="ready"
          data-testid="statement"
          ref={mergedRef}
          resize={"none"}
          maxHeight={"250px"}
          minHeight={`${EVALS.defaultHeight}px`}
          h={`${EVALS.defaultHeight}px`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              console.log("keydown... ", e.key, e.shiftKey);
              if (ref.current.value !== "") {
                newMessage(e);
              }
            }
          }}
          maxLength={600}
        />
        <Flex
          data="send-question"
          alignItems={"center"}
          justifyContent={"center"}
          style={{ backgroundColor: `${themeColor}` }}
          className="btn"
          id="send-question"
          onClick={(e) => {
            e.preventDefault();
            if (ref.current.value !== "") {
              newMessage(e);
            }
          }}
        >
          <IconButton
            isLoading={isProcessing}
            variant={"customIconButton"}
            icon={<FiSend style={{ width: "1.5em", height: "1.5em" }} />}
          />

        </Flex>
      </Flex>
    </HStack>
  );
});
Footer.displayName = "Footer";
export default Footer;
