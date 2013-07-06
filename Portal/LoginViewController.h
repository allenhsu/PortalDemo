//
//  LoginViewController.h
//  Portal
//
//  Created by Allen Hsu on 7/5/13.
//  Copyright (c) 2013 Allen Hsu. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol LoginViewDelegate <NSObject>

- (void)loginViewControllerDidFinishLogin;

@end

@interface LoginViewController : UIViewController

@property (assign, nonatomic) id<LoginViewDelegate> delegate;

@end
