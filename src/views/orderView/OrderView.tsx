import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderStore, type OrderStep } from "../../store/orderStore";
import Button from "../../components/ui/button/Button";
import Header from "../../components/header/Header";
import Breadcrumbs from "../../components/breadcrumbs/Breadcrumbs";
import ConfirmPopup from "../../components/confirmPopup/ConfirmPopup";

import { ADDITIONAL_OPTIONS, RATES } from "../../constants/orderOptions";
import GeoBlock from "../steps/GeoBlock";
import ModelBlock from "../steps/ModelBlock";
import ExtraBlock from "../steps/ExtraBlock";
import SummaryBlock from "../steps/SummaryBlock";

import styles from "./orderView.module.css";

const DISPLAY_RE = /^(\d{2})\.(\d{2})\.(\d{4})\s(\d{2}):(\d{2})$/;

function parseDisplayDate(s: string): Date | null {
  const m = s.match(DISPLAY_RE);
  if (!m) return null;
  const [, d, month, y, h, min] = m;
  return new Date(+y, +month - 1, +d, +h, +min);
}

function formatDuration(start: string, end: string): string {
  const startDate = parseDisplayDate(start);
  const endDate = parseDisplayDate(end);
  if (!startDate || !endDate) return "";

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs <= 0) return "";

  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0 && hours > 0) return `${days}д ${hours}ч`;
  if (days > 0) return `${days}д`;
  return `${hours}ч`;
}

function calcTotalPrice(
  basePrice: number,
  rentalStart: string,
  rentalEnd: string,
  rate: string,
  additionalOptions: string[]
): number | null {
  const start = parseDisplayDate(rentalStart);
  const end = parseDisplayDate(rentalEnd);
  if (!start || !end) return null;

  const diffMs = end.getTime() - start.getTime();
  if (diffMs <= 0) return null;

  let total = basePrice;
  const rateConfig = RATES.find((r) => r.name === rate);
  if (rateConfig) {
    if (rateConfig.unit === 'minute') {
      total += rateConfig.unitPrice * Math.ceil(diffMs / 60000);
    } else {
      total += rateConfig.unitPrice * Math.ceil(diffMs / 86400000);
    }
  }

  additionalOptions.forEach((name) => {
    const opt = ADDITIONAL_OPTIONS.find((o) => o.name === name);
    if (opt) total += opt.price;
  });

  return total;
}

const OrderView = () => {
  const { step: urlStep } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const initializedRef = useRef(false);
  const currentStep = useOrderStore((state) => state.currentStep);
  const setStep = useOrderStore((state) => state.setStep);
  const isStepCompleted = useOrderStore((state) => state.isStepCompleted);
  const canNavigateToStep = useOrderStore((state) => state.canNavigateToStep);
  const pickupPoint = useOrderStore((state) => state.pickupPoint);
  const selectedModel = useOrderStore((state) => state.selectedModel);
  const color = useOrderStore((state) => state.color);
  const rentalStart = useOrderStore((state) => state.rentalStart);
  const rentalEnd = useOrderStore((state) => state.rentalEnd);
  const rate = useOrderStore((state) => state.rate);
  const additionalOptions = useOrderStore((state) => state.additionalOptions);
  const city = useOrderStore((state) => state.city);
  const cityId = useOrderStore((state) => state.cityId);
  const pointId = useOrderStore((state) => state.pointId);
  const saveOrder = useOrderStore((state) => state.saveOrder);
  const savedOrders = useOrderStore((state) => state.savedOrders);
  const cancelOrder = useOrderStore((state) => state.cancelOrder);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const orderId = urlStep && /^\d+$/.test(urlStep) ? Number(urlStep) : null;
  const savedOrder = orderId ? savedOrders.find((o) => o.id === orderId) : null;

  useEffect(() => {
    if (urlStep && /^\d+$/.test(urlStep)) {
      const exists = useOrderStore.getState().savedOrders.some(
        (o) => o.id === Number(urlStep)
      );
      if (!exists) {
        navigate("/order/location", { replace: true });
      }
      return;
    }

    if (!initializedRef.current) {
      initializedRef.current = true;
      if (
        urlStep &&
        ["location", "model", "additional", "total"].includes(urlStep)
      ) {
        const step = urlStep as OrderStep;
        if (canNavigateToStep(step)) {
          setStep(step);
        } else {
          navigate("/order/location", { replace: true });
        }
      } else {
        navigate("/order/location", { replace: true });
      }
    } else if (
      urlStep &&
      ["location", "model", "additional", "total"].includes(urlStep)
    ) {
      const step = urlStep as OrderStep;
      if (canNavigateToStep(step)) {
        setStep(step);
      } else {
        navigate(`/order/${currentStep}`, { replace: true });
      }
    }
  }, [urlStep, canNavigateToStep, setStep, navigate, currentStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const renderStep = () => {
    switch (currentStep) {
      case "location":
        return <GeoBlock />;
      case "model":
        return <ModelBlock />;
      case "additional":
        return <ExtraBlock />;
      case "total":
        return <SummaryBlock />;
      default:
        return <GeoBlock />;
    }
  };

  const handleNextStep = () => {
    if (!isStepCompleted(currentStep)) {
      return;
    }

    switch (currentStep) {
      case "location":
        navigate("/order/model");
        break;
      case "model":
        navigate("/order/additional");
        break;
      case "additional":
        navigate("/order/total");
        break;
      case "total":
        setIsConfirmOpen(true);
        break;
    }
  };

  const handleConfirm = () => {
    if (
      cityId === null ||
      pointId === null ||
      !selectedModel ||
      !rentalStart ||
      !rentalEnd ||
      !rate
    ) {
      return;
    }

    const startDate = parseDisplayDate(rentalStart);
    const endDate = parseDisplayDate(rentalEnd);
    if (!startDate || !endDate) {
      setIsConfirmOpen(false);
      return;
    }

    const price = calcTotalPrice(
      selectedModel.priceMin,
      rentalStart,
      rentalEnd,
      rate,
      additionalOptions,
    );

    const rateConfig = RATES.find((r) => r.name === rate);

    const savedId = saveOrder({
      carName: selectedModel.name,
      cityName: city,
      pointName: pickupPoint,
      rateName: rate,
      orderStatus_id: 1,
      city_id: cityId,
      point_id: pointId,
      car_id: selectedModel.id,
      rate_id: rateConfig?.rateId ?? 0,
      color,
      dateFrom: startDate.getTime(),
      dateTo: endDate.getTime(),
      price: price ?? 0,
      isFullTank: additionalOptions.includes('fuel'),
      isNeedChildChair: additionalOptions.includes('chair'),
      isRightWheel: additionalOptions.includes('right'),
      carThumbnail: selectedModel.thumbnail.path,
    });

    console.log('Сохранённые заказы:', useOrderStore.getState().savedOrders);

    setIsConfirmOpen(false);
    navigate(`/order/${savedId}`, { replace: true });
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };

  const handleCancelOrder = () => {
    if (orderId) {
      cancelOrder(orderId);
      navigate("/order/location", { replace: true });
    }
  };

  const handleBreadcrumbClick = (step: OrderStep) => {
    if (canNavigateToStep(step)) {
      navigate(`/order/${step}`);
    }
  };

  const getButtonText = () => {
    switch (currentStep) {
      case "location":
        return "Выбрать модель";
      case "model":
        return "Дополнительно";
      case "additional":
        return "Итого";
      case "total":
        return "Заказать";
      default:
        return "Далее";
    }
  };

  const isButtonDisabled = () => {
    return !isStepCompleted(currentStep);
  };

  return (
    <div className={styles.main}>
      <div className={styles.Container}>
        <Header></Header>
        <hr />
        {savedOrder ? (
          <div className={styles.orderTitle}>Заказ номер {savedOrder.id}</div>
        ) : (
          <div className={styles.breadcrumbs}>
            <Breadcrumbs
              currentStep={currentStep}
              onStepClick={handleBreadcrumbClick}
            />
          </div>
        )}
        <hr />
        <div className={styles.MainContainer}>
          {savedOrder ? (
            <SummaryBlock savedOrder={savedOrder} />
          ) : (
            <div className={styles.orderStep} key={currentStep}>
              {renderStep()}
            </div>
          )}
          <div className={styles.OrderSummary}>
            <div className={styles.orderTextContainer}>
              {savedOrder ? (
                <>
                  <h5>Ваш заказ:</h5>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Пункт выдачи:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>{savedOrder.pointName}</span>
                  </div>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Модель:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>{savedOrder.carName}</span>
                  </div>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Цвет:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>{savedOrder.color}</span>
                  </div>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Длительность аренды:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>
                      {(() => {
                        const diffMs = savedOrder.dateTo - savedOrder.dateFrom;
                        if (diffMs <= 0) return "";
                        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
                        const days = Math.floor(totalHours / 24);
                        const hours = totalHours % 24;
                        if (days > 0 && hours > 0) return `${days}д ${hours}ч`;
                        if (days > 0) return `${days}д`;
                        return `${hours}ч`;
                      })()}
                    </span>
                  </div>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Тариф:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>{savedOrder.rateName}</span>
                  </div>

                  {savedOrder.isFullTank && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Полный бак</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>Да</span>
                    </div>
                  )}

                  {savedOrder.isNeedChildChair && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Детское кресло</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>Да</span>
                    </div>
                  )}

                  {savedOrder.isRightWheel && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Правый руль</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>Да</span>
                    </div>
                  )}

                  <h4>
                    Цена:{" "}
                    {new Intl.NumberFormat("ru-RU").format(savedOrder.price)} ₽
                  </h4>

                  <Button variant="orange" onClick={handleCancelOrder}>
                    <span>Отменить</span>
                  </Button>
                </>
              ) : (
                <>
                  <h5>Ваш заказ:</h5>

                  <div className={styles.orderRow}>
                    <span className={styles.label}>Пункт выдачи:</span>
                    <span className={styles.dots}>....................................................................................................</span>
                    <span className={styles.infoText}>
                      {pickupPoint || "не выбран"}
                    </span>
                  </div>

                  {currentStep !== "location" && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Модель:</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>
                        {selectedModel?.name || "не выбрана"}
                      </span>
                    </div>
                  )}

                  {currentStep !== "location" && color && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Цвет:</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>{color}</span>
                    </div>
                  )}

                  {currentStep !== "location" && (() => {
                    const duration = formatDuration(rentalStart, rentalEnd);
                    if (!duration) return null;
                    return (
                      <div className={styles.orderRow}>
                        <span className={styles.label}>Длительность аренды:</span>
                        <span className={styles.dots}>....................................................................................................</span>
                        <span className={styles.infoText}>{duration}</span>
                      </div>
                    );
                  })()}

                  {currentStep !== "location" && rate && (
                    <div className={styles.orderRow}>
                      <span className={styles.label}>Тариф:</span>
                      <span className={styles.dots}>....................................................................................................</span>
                      <span className={styles.infoText}>{rate}</span>
                    </div>
                  )}

                  {currentStep !== "location" && additionalOptions.length > 0 && additionalOptions.map((name) => {
                    const option = ADDITIONAL_OPTIONS.find((o) => o.name === name);
                    return (
                      <div className={styles.orderRow} key={name}>
                        <span className={styles.label}>{option?.shortLabel || name}</span>
                        <span className={styles.dots}>....................................................................................................</span>
                        <span className={styles.infoText}>Да</span>
                      </div>
                    );
                  })}

                  {currentStep !== "location" && selectedModel && (() => {
                    const total = calcTotalPrice(
                      selectedModel.priceMin,
                      rentalStart,
                      rentalEnd,
                      rate,
                      additionalOptions
                    );
                    return (
                      <h4>
                        Цена:{" "}
                        {total !== null
                          ? `${new Intl.NumberFormat("ru-RU").format(total)} ₽`
                          : `от ${new Intl.NumberFormat("ru-RU").format(selectedModel.priceMin)} ₽`
                        }
                      </h4>
                    );
                  })()}

                  <Button onClick={handleNextStep} disabled={isButtonDisabled()}>
                    <span>{getButtonText()}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {isConfirmOpen && (
        <ConfirmPopup onConfirm={handleConfirm} onCancel={handleCancel} />
      )}
    </div>
  );
};

export default OrderView;
