/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from "react";
import SlideToggle from "react-slide-toggle";
import { useDispatch, useSelector } from "react-redux";
import { setForm, selectForm } from "../redux/formSlice";
import { Row, Button } from "./BaseTags";

export const baseFormReset = (dispatch, formId, initialValue) => {
  dispatch(setForm({ formId, form: initialValue }));
};

const getFieldValue = (formKey, formValues) => {
  if (Array.isArray(formKey)) {
    return formKey.reduce((obj, cur) => {
      if (obj) return obj[cur];
      return undefined;
    }, formValues);
  }
  return formValues[formKey];
};

const handleSetFormValues = (dispatch, formId, formKey, formValues, val) => {
  const values = JSON.parse(JSON.stringify(formValues));

  if (Array.isArray(formKey)) {
    formKey.reduce((obj, cur, index) => {
      if (obj) {
        if (index === formKey.length - 1)
          obj[cur] = typeof obj[cur] === "number" ? parseInt(val, 10) : val;
        return obj[cur];
      }
      return undefined;
    }, values);
  } else
    values[formKey] =
      typeof values[formKey] === "number" ? parseInt(val, 10) : val;

  dispatch(setForm({ formId, form: values }));
};

export default function BaseForm(props) {
  const {
    formId = "", // Should be unique
    initialValues = {},
    updater = [],
    children,
    allowSubmit = false,
    submitText = "Submit",
    onSubmit = () => {},
    otherFooter = <></>,
    otherFooter2 = <></>,
  } = props;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setForm({ formId, form: initialValues }));
  }, []);
  const { [formId]: formValues } = useSelector(selectForm(formId));

  updater.forEach((upd) => {
    useEffect(() => {
      if (getFieldValue(upd.depend, formValues) !== undefined) {
        dispatch(
          setForm({
            formId,
            form: upd.update(
              upd.depend,
              JSON.parse(JSON.stringify(formValues)),
              getFieldValue(upd.depend, formValues)
            ),
          })
        );
      }
    }, [getFieldValue(upd.depend, formValues)]);
  });

  const handleOnSubmit = (e) => {
    onSubmit(formValues);
    e.preventDefault(); // Prevent page refreshing
  };

  return (
    <form onSubmit={handleOnSubmit}>
      {children}
      {allowSubmit && (
        <Row>
          {otherFooter}
          <div className="update ml-auto mr-auto">
            <Button type="submit" round theme="primary">
              {submitText}
            </Button>
          </div>
          {otherFooter2}
        </Row>
      )}
    </form>
  );
}

export const BaseFormGroup = (props) => {
  const { formId, label = "", children = <></>, hidden = false } = props;
  const { [formId]: formValues } = useSelector(selectForm(formId));

  const inputHidden = () => {
    if (typeof hidden === "boolean") return hidden;
    return hidden(null, formValues, getFieldValue);
  };

  return (
    <div
      className="form-group"
      style={{ display: inputHidden() ? "none" : null }}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      {label && <label>{label}</label>}
      {children}
    </div>
  );
};

export const BaseFormInput = (props) => {
  const dispatch = useDispatch();
  const {
    id = "", // For label
    className = "",
    formId = "",
    formKey = "",
    type = "text",
    name = "", // For radio & checkbox
    disabled = false,
    placeholder = "",
    inputValue = "", // For radio & checkbox
    style = {},
    hidden = false, // Boolean or Function
    validator = (value) => value,
    CustomInput = null, // Custom Component
    ...restProps
  } = props;
  const { [formId]: formValues } = useSelector(selectForm(formId));

  const inputHidden = () => {
    if (typeof hidden === "boolean") return hidden;
    return hidden(
      getFieldValue(formKey, formValues),
      formValues,
      getFieldValue
    );
  };

  const handleValidateUpdate = (e) => {
    handleSetFormValues(
      dispatch,
      formId,
      formKey,
      formValues,
      validator(e.target.value)
    );
  };

  const inputProps = {
    ...restProps,
    id: id || null,
    className: `form-control ${className}`,
    type,
    name,
    disabled,
    placeholder,
    checked: String(getFieldValue(formKey, formValues)) === String(inputValue),
    value:
      String(inputValue) || String(getFieldValue(formKey, formValues)) || "",
    onChange: handleValidateUpdate,
    style: {
      ...style,
      display: inputHidden() ? "none" : null,
    },
  };

  if (CustomInput) return <CustomInput {...inputProps} />;

  return <input {...inputProps} />;
};

export const BaseFormTextarea = (props) => {
  const dispatch = useDispatch();
  const {
    className = "",
    formId = "",
    formKey = "",
    placeholder = "",
    style = {},
    hidden = false, // Boolean or Function
    validator = (value) => value,
    CustomTextarea = null, // Custom Component
  } = props;
  const { [formId]: formValues } = useSelector(selectForm(formId));

  const textareaHidden = () => {
    if (typeof hidden === "boolean") return hidden;
    return hidden(
      getFieldValue(formKey, formValues),
      formValues,
      getFieldValue
    );
  };

  const handleValidateUpdate = (e) => {
    handleSetFormValues(
      dispatch,
      formId,
      formKey,
      formValues,
      validator(e.target.value)
    );
  };

  const textareaProps = {
    className: `form-control ${className}`,
    placeholder,
    value: String(getFieldValue(formKey, formValues)) || "",
    onChange: handleValidateUpdate,
    style: {
      ...style,
      display: textareaHidden() ? "none" : null,
    },
  };

  if (CustomTextarea) return <CustomTextarea {...textareaProps} />;

  return <textarea {...textareaProps} />;
};

export const BaseFormSelect = (props) => {
  const {
    className = "",
    formId = "",
    formKey = "",
    children = <></>,
    placeholder = "",
    style = {},
    hidden = false, // Boolean or Function
    CustomSelect = null, // Custom Component
  } = props;
  const { [formId]: formValues } = useSelector(selectForm(formId));

  const [active, setActive] = useState(false);
  const selectRef = useRef();

  const selectHidden = () => {
    if (typeof hidden === "boolean") return hidden;
    return hidden(
      getFieldValue(formKey, formValues),
      formValues,
      getFieldValue
    );
  };

  const handleClick = (toggle) => () => {
    selectRef.current.focus();
    setActive((a) => !a);
    toggle();
  };

  const handleBlur = (toggle, progress) => () => {
    if (progress === 1) {
      setActive(false);
      toggle();
    }
  };

  const selectProps = {
    className: `select-dropdown form-control ${
      active ? "active" : ""
    } ${className}`,
    style: {
      padding: 0,
      textTransform: "capitalize",
      ...style,
      display: selectHidden() ? "none" : null,
    },
  };

  if (CustomSelect)
    return <CustomSelect {...selectProps}>{children}</CustomSelect>;

  return (
    <SlideToggle duration={300} collapsed>
      {({ toggle, setCollapsibleElement, progress }) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <div
          {...selectProps}
          role="button"
          onClick={handleClick(toggle)}
          onBlur={handleBlur(toggle, progress)}
          ref={selectRef}
          tabIndex={0}
        >
          <div className="select" style={{ padding: "10px" }}>
            <span>{getFieldValue(formKey, formValues) || placeholder}</span>
            <i className="fa fa-chevron-left" />
          </div>
          <ul
            className="select-dropdown-menu form-control"
            ref={setCollapsibleElement}
            style={{ border: 0, marginBottom: 0 }}
          >
            {children}
          </ul>
        </div>
      )}
    </SlideToggle>
  );
};

export const BaseFormOption = (props) => {
  const dispatch = useDispatch();
  const {
    className = "",
    formId = "",
    formKey = "",
    children = <></>,
    value = "",
    style = {},
    hidden = false, // Boolean or Function
    validator = (v) => v,
    CustomOption = null, // Custom Component
  } = props;
  const { [formId]: formValues } = useSelector(selectForm(formId));

  const optionHidden = () => {
    if (typeof hidden === "boolean") return hidden;
    return hidden(
      getFieldValue(formKey, formValues),
      formValues,
      getFieldValue
    );
  };

  const handleValidateUpdate = () => {
    handleSetFormValues(
      dispatch,
      formId,
      formKey,
      formValues,
      validator(value)
    );
  };

  const optionProps = {
    className,
    onClick: handleValidateUpdate,
    style: {
      textTransform: "capitalize",
      ...style,
      display: optionHidden() ? "none" : null,
    },
  };

  if (CustomOption)
    return <CustomOption {...optionProps}>{children}</CustomOption>;

  return <li {...optionProps}>{children}</li>;
};
