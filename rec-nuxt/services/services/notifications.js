export default {
  // toaster(component) {
  //   return component.$root.$refs.toastr
  // },

  success(component, message) {
    console.log('Success');
    console.log(message);
  },

  error(component, message) {
    console.log('Error');
    console.log(message);
  },

  information(component, message) {
    console.log('Information');
    console.log(message);
  },

  removeInformation(component) {
    console.log('Information removed');
  },
};

// export default {
//   toaster(component) {
//     return component.$root.$refs.toastr
//   },
//
//   success(component, message) {
//     this.toaster(component).s(message)
//   },
//
//   error(component, message) {
//     this.toaster(component).e(message)
//   },
//
//   information(component, message) {
//     this.toaster(component).i({
//       msg: message,
//       timeout: 30000,
//     })
//   },
//
//   removeInformation(component) {
//     this.toaster(component).removeByType('info')
//   },
// }

//
// export const toaster = toast => {
//   if (!toast.error || !toast.success || !toast.information || !toast.removeInformation)
//     throw new Error('Parameter should be an object with methods error, success, information and removeInformation');
//   return {
//     error: (component, message) => {
//       toast.error(component, message);
//     },
//     success: (component, message) => {
//       toast.success(component, message);
//     },
//     information: (component, message) => {
//       toast.information(component, message);
//     },
//     removeInformation: (component) => {
//       toast.removeInformation(component);
//     },
//   };
// };
//
// export const vueToasterAdaptor = () => {
//   // make sure tool is an object with the init method on it
//   // if (!tool.init)
//   //   throw new Error('Parameter should be an object with an init method');
//   // if (!tool.captureException)
//   //   throw new Error(
//   //     'Parameter should be an object with an captureException method'
//   //   );
//
//   return {
//     error: (component, message) => component.$root.$refs.toastr.e(message),
//     success: (component, message) => component.$root.$refs.toastr.s(message),
//     information: (component, message) => component.$root.$refs.toastr.i({
//       msg: message,
//       timeout: 30000,
//     }),
//     removeInformation: (component) => component.$root.$refs.toastr.removeByType('info')
//   };
// };
//
// export default toaster(vueToasterAdaptor());

//
// import * as Sentry from '@sentry/browser';
// import { isProduction } from 'utils';
//
// export const logger = log => {
//   if (!log.error)
//     throw new Error('Parameter should be an object with an error method');
//   return {
//     error: message => {
//       log.error(new Error(message));
//     },
//   };
// };
//
// export const sentryAdaptor = (tool = Sentry, isProd = isProduction()) => {
//   // make sure tool is an object with the init method on it
//   if (!tool.init)
//     throw new Error('Parameter should be an object with an init method');
//   if (!tool.captureException)
//     throw new Error(
//       'Parameter should be an object with an captureException method'
//     );
//
//   if (isProd) {
//     tool.init({
//       dsn: 'https://25aa9fb630084cc4b9118ec757b1a5dc@sentry.io/1469472',
//     });
//   }
//
//
//   return {
//     error: isProd ? tool.captureException : console.error, // eslint-disable-line no-console
//   };
// };

// export default logger(sentryAdaptor());
